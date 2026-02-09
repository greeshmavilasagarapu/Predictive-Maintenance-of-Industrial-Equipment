
import { EngineData, SensorReading, SummaryMetrics } from '../types';

const SENSOR_NAMES = [
  'T2', 'T24', 'T30', 'T50', 'P2', 'P15', 'P30', 'Nf', 'Nc', 'epr', 
  'Ps30', 'phi', 'NRf', 'NRc', 'BPR', 'farB', 'htBleed', 'Nf_dmd', 'PCNfR_dmd', 'W31', 'W32'
];

const generateSensorReadings = (totalCycles: number, isCritical: boolean): SensorReading[] => {
  const readings: SensorReading[] = [];
  for (let cycle = 1; cycle <= totalCycles; cycle++) {
    const reading: SensorReading = { cycle };
    
    // Simulate typical sensor trends in degradation
    const degradationFactor = isCritical ? (cycle / totalCycles) : (cycle / (totalCycles * 1.5));
    
    SENSOR_NAMES.forEach(sensor => {
      // Base values and noise
      let base = 500 + Math.random() * 100;
      let trend = 0;
      
      // Select few sensors to have noticeable trends like in CMAPSS
      if (['T24', 'T50', 'Ps30', 'phi', 'W31'].includes(sensor)) {
        trend = degradationFactor * 50; // Increasing trend
      } else if (['Nc', 'NRc', 'BPR'].includes(sensor)) {
        trend = -degradationFactor * 30; // Decreasing trend
      }
      
      reading[sensor] = parseFloat((base + trend + (Math.random() - 0.5) * 5).toFixed(2));
    });
    readings.push(reading);
  }
  return readings;
};

export const generateMockEngines = (count: number): EngineData[] => {
  const engines: EngineData[] = [];
  for (let i = 1; i <= count; i++) {
    const totalCycles = 150 + Math.floor(Math.random() * 100);
    const currentCycle = Math.floor(totalCycles * (0.3 + Math.random() * 0.6));
    const predictedRul = totalCycles - currentCycle;
    
    let status: 'Healthy' | 'Degrading' | 'Critical' = 'Healthy';
    if (predictedRul < 30) status = 'Critical';
    else if (predictedRul < 80) status = 'Degrading';

    engines.push({
      id: i,
      totalCycles,
      currentCycle,
      predictedRul,
      status,
      readings: generateSensorReadings(currentCycle, status === 'Critical')
    });
  }
  return engines;
};

export const calculateSummary = (engines: EngineData[]): SummaryMetrics => {
  const totalEngines = engines.length;
  const totalRul = engines.reduce((acc, e) => acc + e.predictedRul, 0);
  const maxRul = Math.max(...engines.map(e => e.predictedRul));
  const criticalCount = engines.filter(e => e.status === 'Critical').length;

  return {
    avgRul: Math.round(totalRul / totalEngines),
    maxRul,
    totalEngines,
    criticalCount
  };
};
