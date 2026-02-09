
import React, { useState } from 'react';
import { EngineData } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
// Added AlertCircle and Clock to fix "Cannot find name" errors
import { Layers, Activity, Wind, Gauge, AlertCircle, Clock } from 'lucide-react';

interface AdvancedAnalyticsProps {
  engines: EngineData[];
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ engines }) => {
  const [selectedId, setSelectedId] = useState(engines[0]?.id || 1);
  const engine = engines.find(e => e.id === selectedId) || engines[0];

  // Radar data for engine health signature
  const latest = engine.readings[engine.readings.length - 1];
  const radarData = [
    { subject: 'Thermal', A: (latest.T50 / 800) * 100, fullMark: 100 },
    { subject: 'Pressure', A: (latest.Ps30 / 600) * 100, fullMark: 100 },
    { subject: 'Efficiency', A: (engine.predictedRul / 150) * 100, fullMark: 100 },
    { subject: 'Flow', A: (latest.W31 / 600) * 100, fullMark: 100 },
    { subject: 'Rotation', A: (latest.NRc / 600) * 100, fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0B1F3A]">Advanced Analytics</h2>
          <p className="text-slate-500">Multi-variate degradation signals & health signatures</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm focus:outline-none"
            value={selectedId}
            onChange={(e) => setSelectedId(Number(e.target.value))}
          >
            {engines.slice(0, 15).map(e => <option key={e.id} value={e.id}>Engine #{e.id}</option>)}
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Health Signature */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
          <h3 className="text-sm font-bold text-slate-700 mb-4 self-start uppercase tracking-wider">Engine Health Signature</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" fontSize={10} fontWeight={600} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
                <Radar
                  name="Health"
                  dataKey="A"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 w-full space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Current Health Index</span>
              <span className="font-bold text-slate-900">{Math.round((engine.predictedRul / 150) * 100)}/100</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500" style={{ width: `${(engine.predictedRul / 150) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Sensor Micro-trends */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
           <SensorMicroPlot title="Exhaust Gas Temp (T50)" data={engine.readings} dataKey="T50" color="#3B82F6" icon={<Activity size={14} />} />
           <SensorMicroPlot title="Bypass Ratio (BPR)" data={engine.readings} dataKey="BPR" color="#10B981" icon={<Wind size={14} />} />
           <SensorMicroPlot title="HPC Outlet Pressure (Ps30)" data={engine.readings} dataKey="Ps30" color="#F59E0B" icon={<Gauge size={14} />} />
           <SensorMicroPlot title="Ratio of Fuel to Air (phi)" data={engine.readings} dataKey="phi" color="#8B5CF6" icon={<Layers size={14} />} />
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-bold text-slate-700 mb-6 uppercase tracking-wider">Maintenance Insight Panel</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="flex gap-4">
             <div className="h-12 w-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
               <AlertCircle size={24} />
             </div>
             <div>
               <h4 className="font-bold text-slate-900 text-sm mb-1">Critical Priority Maintenance</h4>
               <p className="text-xs text-slate-500 leading-relaxed mb-3">Assets requiring immediate removal from fleet rotation due to high risk of failure within next 15-20 cycles.</p>
               <div className="flex flex-wrap gap-2">
                 {engines.filter(e => e.status === 'Critical').slice(0, 3).map(e => (
                   <span key={e.id} className="px-2 py-1 bg-rose-50 border border-rose-100 rounded text-[10px] font-bold text-rose-600">Engine #{e.id}</span>
                 ))}
                 <span className="text-[10px] text-slate-400 italic">Total: {engines.filter(e => e.status === 'Critical').length} assets</span>
               </div>
             </div>
           </div>

           <div className="flex gap-4">
             <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
               <Clock size={24} />
             </div>
             <div>
               <h4 className="font-bold text-slate-900 text-sm mb-1">Scheduled Preventive Actions</h4>
               <p className="text-xs text-slate-500 leading-relaxed mb-3">Optimal window for maintenance to minimize downtime costs and maximize component longevity.</p>
               <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-50 border border-blue-100 rounded text-[10px] font-bold text-blue-600">Avg Interval: 65 Cycles</span>
                  <span className="px-2 py-1 bg-blue-50 border border-blue-100 rounded text-[10px] font-bold text-blue-600">Fleet Health: 84%</span>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const SensorMicroPlot: React.FC<{ title: string; data: any[]; dataKey: string; color: string; icon: React.ReactNode }> = ({ 
  title, data, dataKey, color, icon 
}) => (
  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
    <div className="flex items-center gap-2 mb-4">
      <div className="p-1.5 rounded-lg bg-white shadow-sm" style={{ color }}>{icon}</div>
      <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{title}</h4>
    </div>
    <div className="h-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
          <XAxis dataKey="cycle" hide />
          <YAxis hide domain={['auto', 'auto']} />
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default AdvancedAnalytics;
