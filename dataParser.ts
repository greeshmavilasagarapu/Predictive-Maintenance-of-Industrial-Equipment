
import { EngineData, SensorReading } from '../types';

const SENSOR_NAMES = [
  'T2', 'T24', 'T30', 'T50', 'P2', 'P15', 'P30', 'Nf', 'Nc', 'epr', 
  'Ps30', 'phi', 'NRf', 'NRc', 'BPR', 'farB', 'htBleed', 'Nf_dmd', 'PCNfR_dmd', 'W31', 'W32'
];

export const parseCMAPSSFile = (content: string): EngineData[] => {
  const lines = content.trim().split('\n');
  const engineMap = new Map<number, EngineData>();

  lines.forEach(line => {
    const parts = line.trim().split(/\s+/).map(Number);
    if (parts.length < 2) return;

    const id = parts[0];
    const cycle = parts[1];
    
    const reading: SensorReading = { cycle };
    SENSOR_NAMES.forEach((name, idx) => {
      reading[name] = parts[idx + 5] || 0;
    });

    if (!engineMap.has(id)) {
      engineMap.set(id, {
        id,
        totalCycles: cycle,
        currentCycle: cycle,
        predictedRul: 0,
        status: 'Healthy',
        readings: []
      });
    }

    const engine = engineMap.get(id)!;
    engine.readings.push(reading);
    if (cycle > engine.totalCycles) engine.totalCycles = cycle;
    engine.currentCycle = cycle;
  });

  return Array.from(engineMap.values()).map(engine => {
    engine.readings.sort((a, b) => a.cycle - b.cycle);
    
    // Simulate ML "Logic": Calculate slope of T50 (Exhaust Gas Temp)
    // Higher T50 slope = faster degradation = lower RUL
    const windowSize = Math.min(engine.readings.length, 10);
    const recentReadings = engine.readings.slice(-windowSize);
    const firstVal = recentReadings[0]?.T50 || 500;
    const lastVal = recentReadings[recentReadings.length - 1]?.T50 || 500;
    const slope = (lastVal - firstVal) / windowSize;

    const lastCycle = engine.readings[engine.readings.length - 1].cycle;
    
    // Create a unique prediction based on data trends + a deterministic noise factor from ID
    const baseLife = 180 + (engine.id % 40);
    const slopePenalty = slope * 15; // Higher slope decreases life
    const estimatedTotalLife = Math.max(lastCycle + 5, Math.round(baseLife - slopePenalty));
    
    const predictedRul = Math.max(0, estimatedTotalLife - lastCycle);
    
    let status: 'Healthy' | 'Degrading' | 'Critical' = 'Healthy';
    if (predictedRul < 25) status = 'Critical';
    else if (predictedRul < 65) status = 'Degrading';

    return {
      ...engine,
      predictedRul,
      status,
      totalCycles: estimatedTotalLife
    };
  });
};
