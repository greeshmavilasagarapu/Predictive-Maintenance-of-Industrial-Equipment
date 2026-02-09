
import React from 'react';
import { LayoutDashboard, Database, TrendingUp, BarChart3, Info, Zap } from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: ViewType.OVERVIEW, label: 'Model Overview', icon: LayoutDashboard },
    { id: ViewType.DATASET, label: 'Dataset Explorer', icon: Database },
    { id: ViewType.PREDICTIONS, label: 'Prediction Results', icon: TrendingUp },
    { id: ViewType.ANALYTICS, label: 'Advanced Analytics', icon: BarChart3 },
    { id: ViewType.INFO, label: 'Project Information', icon: Info },
  ];

  return (
    <div className="w-64 bg-[#0B1F3A] h-screen fixed left-0 top-0 text-white flex flex-col z-50">
      <div className="p-6 flex items-center gap-3 border-b border-slate-700">
        <div className="p-2 bg-blue-500 rounded-lg">
          <Zap size={24} className="text-white fill-current" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight">JetSense</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Predictive ML</p>
        </div>
      </div>
      
      <nav className="flex-1 mt-6 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-700">
        <div className="bg-slate-800/50 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Inference Engine</p>
          <p className="text-sm font-semibold text-blue-400">LSTM-v2.0-CORE</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
