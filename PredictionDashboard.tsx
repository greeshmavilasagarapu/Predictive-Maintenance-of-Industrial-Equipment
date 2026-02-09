
import React, { useState } from 'react';
import { EngineData } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea
} from 'recharts';
import { ShieldCheck, AlertCircle, Zap, TrendingDown } from 'lucide-react';

interface PredictionDashboardProps {
  engines: EngineData[];
}

const PredictionDashboard: React.FC<PredictionDashboardProps> = ({ engines }) => {
  const [selectedEngineId, setSelectedEngineId] = useState(engines[0]?.id || 1);
  const selectedEngine = engines.find(e => e.id === selectedEngineId) || engines[0];

  // Mock predicted RUL trend (since we only have the current cycle data in our mock)
  // We'll simulate a historical prediction trend for the UI
  const predictionTrend = Array.from({ length: selectedEngine.currentCycle }).map((_, i) => ({
    cycle: i + 1,
    actualRul: selectedEngine.totalCycles - (i + 1),
    predictedRul: selectedEngine.totalCycles - (i + 1) + (Math.random() - 0.5) * 8
  }));

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0B1F3A]">Prediction Results</h2>
          <p className="text-slate-500">In-depth RUL trajectory for specific assets</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-500">Engine Profile:</span>
          <select 
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={selectedEngineId}
            onChange={(e) => setSelectedEngineId(Number(e.target.value))}
          >
            {engines.map(e => (
              <option key={e.id} value={e.id}>Engine ID: #{e.id.toString().padStart(3, '0')}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main RUL Plot */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-2">
               <TrendingDown className="text-blue-500" size={20} />
               <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Remaining Useful Life (RUL) Trajectory</h3>
             </div>
             <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-slate-300" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Ground Truth</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-blue-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">LSTM Prediction</span>
                </div>
             </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictionTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E9F0" />
                <XAxis dataKey="cycle" label={{ value: 'Operating Cycles', position: 'bottom', offset: -5, fontSize: 10 }} axisLine={false} tickLine={false} fontSize={12} />
                <YAxis label={{ value: 'RUL (Cycles)', angle: -90, position: 'insideLeft', fontSize: 10 }} axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <ReferenceArea y1={0} y2={30} fill="#E74C3C" fillOpacity={0.05} />
                <ReferenceArea y1={30} y2={80} fill="#F1C40F" fillOpacity={0.05} />
                <Line type="monotone" dataKey="actualRul" stroke="#E2E8F0" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="predictedRul" stroke="#3B82F6" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#3B82F6', stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Prediction Insights Card */}
        <div className="space-y-6">
          <div className="bg-[#0B1F3A] p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">Estimated RUL</p>
              <div className="flex items-baseline gap-2">
                <h4 className="text-6xl font-black">{selectedEngine.predictedRul}</h4>
                <span className="text-blue-300 text-sm font-semibold">Cycles</span>
              </div>
              
              <div className={`mt-6 px-3 py-1.5 rounded-lg inline-flex items-center gap-2 text-xs font-bold uppercase ${
                selectedEngine.status === 'Healthy' ? 'bg-emerald-500/20 text-emerald-400' :
                selectedEngine.status === 'Degrading' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-rose-500/20 text-rose-400'
              }`}>
                {selectedEngine.status === 'Healthy' ? <ShieldCheck size={14} /> :
                 selectedEngine.status === 'Degrading' ? <AlertCircle size={14} /> :
                 <Zap size={14} />}
                {selectedEngine.status} Condition
              </div>

              <p className="mt-4 text-slate-400 text-xs leading-relaxed">
                {selectedEngine.status === 'Healthy' ? 'Operational health is within nominal limits. No immediate intervention suggested.' :
                 selectedEngine.status === 'Degrading' ? 'Minor degradation detected in thermal efficiency. Schedule inspection within 40 cycles.' :
                 'Critical component wear detected. Immediate maintenance grounding required to prevent catastrophic failure.'}
              </p>
            </div>
            {/* Abstract background shape */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl" />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Reliability Score</h3>
            <div className="space-y-4">
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    selectedEngine.status === 'Healthy' ? 'bg-emerald-500' :
                    selectedEngine.status === 'Degrading' ? 'bg-yellow-500' :
                    'bg-rose-500'
                  }`}
                  style={{ width: `${(selectedEngine.predictedRul / 150) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>0% Reliability</span>
                <span>100% Reliability</span>
              </div>
              
              <div className="pt-4 border-t border-slate-50 space-y-3">
                <InsightItem 
                  label="Mean Squared Error (MSE)" 
                  value="12.42" 
                  description="Overall model accuracy for this asset"
                />
                <InsightItem 
                  label="Feature Impact" 
                  value="High (T50)" 
                  description="Primary sensor driving this prediction"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InsightItem: React.FC<{ label: string; value: string; description: string }> = ({ label, value, description }) => (
  <div>
    <div className="flex justify-between items-baseline mb-0.5">
      <span className="text-xs font-bold text-slate-700">{label}</span>
      <span className="text-xs font-mono font-bold text-blue-600">{value}</span>
    </div>
    <p className="text-[10px] text-slate-400">{description}</p>
  </div>
);

export default PredictionDashboard;
