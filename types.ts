
export enum ViewType {
  OVERVIEW = 'overview',
  DATASET = 'dataset',
  PREDICTIONS = 'predictions',
  ANALYTICS = 'analytics',
  INFO = 'info'
}

export interface SensorReading {
  cycle: number;
  [key: string]: number;
}

export interface EngineData {
  id: number;
  totalCycles: number;
  currentCycle: number;
  predictedRul: number;
  status: 'Healthy' | 'Degrading' | 'Critical';
  readings: SensorReading[];
}

export interface SummaryMetrics {
  avgRul: number;
  maxRul: number;
  totalEngines: number;
  criticalCount: number;
}
