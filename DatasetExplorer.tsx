
import React, { useState } from 'react';
import { EngineData } from '../types';
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Cell
} from 'recharts';
import { Search } from 'lucide-react';

interface DatasetExplorerProps {
  engines: EngineData[];
}

const DatasetExplorer: React.FC<DatasetExplorerProps> = ({ engines }) => {
  const [selectedSensor, setSelectedSensor] = useState('T50');
  
  const scatterData = engines.flatMap(e => 
    e.readings.slice(-1).map(r => ({
      cycle: e.currentCycle,
      value: r[selectedSensor],
      engineId: e.id,
      status: e.status
    }))
  );

  const sensors = ['T24', 'T50', 'Ps30', 'phi', 'W31', 'Nc', 'NRc', 'BPR'];

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0B1F3A]">Dataset Explorer</h2>
          <p className="text-slate-500">Distribution analysis for {engines.length} assets</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search features..." 
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Feature Variance vs Lifetime</h3>
            <select 
              value={selectedSensor}
              onChange={(e) => setSelectedSensor(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-sm font-medium outline-none"
            >
              {sensors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" vertical={false} />
                <XAxis type="number" dataKey="cycle" name="Cycles" axisLine={false} tickLine={false} fontSize={10} />
                <YAxis type="number" dataKey="value" name="Value" axisLine={false} tickLine={false} fontSize={10} />
                <ZAxis type="number" range={[50, 200]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Engines" data={scatterData}>
                  {scatterData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.status === 'Critical' ? '#E74C3C' : entry.status === 'Degrading' ? '#F1C40F' : '#2ECC71'} 
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Current Cycle Snapshot</h3>
          <div className="flex-1 overflow-auto border rounded-xl border-slate-100">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 sticky top-0">
                <tr>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Cycle</th>
                  <th className="px-3 py-2">{selectedSensor}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {engines.slice(0, 15).map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2 font-bold">#{e.id}</td>
                    <td className="px-3 py-2">{e.currentCycle}</td>
                    <td className="px-3 py-2 font-mono text-blue-600">{e.readings[e.readings.length - 1][selectedSensor]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-slate-400 mt-4 text-center">Displaying first 15 assets from current dataset</p>
        </div>
      </div>
    </div>
  );
};

export default DatasetExplorer;
