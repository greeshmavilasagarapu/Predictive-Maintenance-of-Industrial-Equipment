
import React from 'react';
import { SummaryMetrics, EngineData } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie
} from 'recharts';
import { Activity, Clock, Server, AlertTriangle } from 'lucide-react';

interface ModelOverviewProps {
  metrics: SummaryMetrics;
  engines: EngineData[];
}

const ModelOverview: React.FC<ModelOverviewProps> = ({ metrics, engines }) => {
  const statusData = [
    { name: 'Healthy', value: engines.filter(e => e.status === 'Healthy').length, color: '#2ECC71' },
    { name: 'Degrading', value: engines.filter(e => e.status === 'Degrading').length, color: '#F1C40F' },
    { name: 'Critical', value: engines.filter(e => e.status === 'Critical').length, color: '#E74C3C' },
  ];

  const distributionData = [
    { range: '0-20', count: engines.filter(e => e.predictedRul <= 20).length },
    { range: '21-50', count: engines.filter(e => e.predictedRul > 20 && e.predictedRul <= 50).length },
    { range: '51-100', count: engines.filter(e => e.predictedRul > 50 && e.predictedRul <= 100).length },
    { range: '101-150', count: engines.filter(e => e.predictedRul > 100 && e.predictedRul <= 150).length },
    { range: '150+', count: engines.filter(e => e.predictedRul > 150).length },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-[#0B1F3A]">JetSense Machine Learning Engine</h2>
        <p className="text-slate-500 max-w-2xl mt-1">
          Predicting Remaining Useful Life (RUL) through high-frequency sensor analysis and LSTM temporal memory modeling.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Avg Predicted RUL" 
          value={metrics.avgRul} 
          unit="Cycles" 
          icon={<Clock className="text-blue-500" />} 
          color="border-blue-500"
        />
        <StatCard 
          label="Max Predicted RUL" 
          value={metrics.maxRul} 
          unit="Cycles" 
          icon={<Activity className="text-emerald-500" />} 
          color="border-emerald-500"
        />
        <StatCard 
          label="Assets Evaluated" 
          value={metrics.totalEngines} 
          unit="Units" 
          icon={<Server className="text-indigo-500" />} 
          color="border-indigo-500"
        />
        <StatCard 
          label="Critical Priority" 
          value={metrics.criticalCount} 
          unit="Alerts" 
          icon={<AlertTriangle className="text-rose-500" />} 
          color="border-rose-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RUL Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Estimated RUL Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E9F0" />
                <XAxis dataKey="range" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#F8FAFC'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fleet Status */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Fleet Reliability Matrix</h3>
          <div className="flex flex-col md:flex-row items-center justify-between h-full">
            <div className="h-48 w-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 flex-1 px-8">
              {statusData.map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-sm text-slate-600 font-medium">{s.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{s.value} Assets</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: number | string; unit: string; icon: React.ReactNode; color: string }> = ({ 
  label, value, unit, icon, color 
}) => (
  <div className={`bg-white p-5 rounded-2xl shadow-sm border-l-4 ${color} flex items-center justify-between`}>
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
        <span className="text-xs text-slate-400">{unit}</span>
      </div>
    </div>
    <div className="p-3 bg-slate-50 rounded-xl">
      {icon}
    </div>
  </div>
);

export default ModelOverview;
