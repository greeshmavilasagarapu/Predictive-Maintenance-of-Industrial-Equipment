
import React from 'react';
// Added Activity to fix "Cannot find name 'Activity'" error
import { BookOpen, Cpu, Database, Globe, Layers, Settings, Activity } from 'lucide-react';

const SystemInfo: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      <header>
        <h2 className="text-2xl font-bold text-[#0B1F3A]">Project Information</h2>
        <p className="text-slate-500 mt-1">Machine Learning architecture and dataset provenance</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Problem Statement */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <div className="flex items-center gap-3 mb-4">
             <BookOpen className="text-blue-600" size={20} />
             <h3 className="font-bold text-slate-800">Problem Statement</h3>
           </div>
           <p className="text-sm text-slate-600 leading-relaxed mb-4">
             In complex industrial environments like aviation, premature equipment failure results in high maintenance costs, operational downtime, and potential safety risks. Traditional "reactive" maintenance (fixing after failure) is inefficient.
           </p>
           <p className="text-sm text-slate-600 leading-relaxed">
             This system leverages the <strong>NASA CMAPSS</strong> dataset to develop a deep-learning solution that predicts <strong>Remaining Useful Life (RUL)</strong>, transitioning operations from reactive to proactive maintenance schedules.
           </p>
        </div>

        {/* Tech Stack */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <div className="flex items-center gap-3 mb-6">
             <Cpu className="text-blue-600" size={20} />
             <h3 className="font-bold text-slate-800">Technology Stack</h3>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <TechBadge icon={<Globe size={14} />} name="Python 3.10" />
              <TechBadge icon={<Layers size={14} />} name="TensorFlow / Keras" />
              <TechBadge icon={<Database size={14} />} name="Pandas / NumPy" />
              <TechBadge icon={<Settings size={14} />} name="Scikit-learn" />
              <TechBadge icon={<Activity size={14} />} name="Matplotlib / Seaborn" />
              <TechBadge icon={<Layers size={14} />} name="Streamlit Visualization" />
           </div>
        </div>

        {/* Model Details */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <div className="flex items-center gap-3 mb-6">
             <Layers className="text-blue-600" size={20} />
             <h3 className="font-bold text-slate-800">Model Architecture</h3>
           </div>
           <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Neural Network</span>
                  <span className="text-xs font-mono font-bold text-blue-600">LSTM (RNN)</span>
                </div>
                <p className="text-xs text-slate-500 leading-normal">
                  Long Short-Term Memory network designed to capture temporal dependencies in time-series telemetry data.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Input Shape</span>
                  <span className="text-xs font-mono font-bold text-blue-600">[30, 24]</span>
                </div>
                <p className="text-xs text-slate-500 leading-normal">
                  30 past time-steps across 24 features (3 OpSettings + 21 Sensors).
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Output</span>
                  <span className="text-xs font-mono font-bold text-blue-600">Continuous Regression</span>
                </div>
                <p className="text-xs text-slate-500 leading-normal">
                  Predicts a scalar value representing the exact cycle count remaining.
                </p>
              </div>
           </div>
        </div>

        {/* Real-world applications */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <div className="flex items-center gap-3 mb-6">
             <Globe className="text-blue-600" size={20} />
             <h3 className="font-bold text-slate-800">Industrial Applications</h3>
           </div>
           <ul className="space-y-3">
             <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <div className="text-sm">
                  <span className="font-bold text-slate-800">Aviation Maintenance:</span>
                  <p className="text-slate-500 text-xs mt-0.5">Optimizing engine overhaul cycles for commercial airline fleets.</p>
                </div>
             </li>
             <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <div className="text-sm">
                  <span className="font-bold text-slate-800">Power Plant Ops:</span>
                  <p className="text-slate-500 text-xs mt-0.5">Monitoring gas turbines to prevent unplanned grid outages.</p>
                </div>
             </li>
             <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <div className="text-sm">
                  <span className="font-bold text-slate-800">Manufacturing:</span>
                  <p className="text-slate-500 text-xs mt-0.5">Predicting spindle failure in high-precision CNC machining tools.</p>
                </div>
             </li>
           </ul>
        </div>
      </div>
    </div>
  );
};

const TechBadge: React.FC<{ icon: React.ReactNode; name: string }> = ({ icon, name }) => (
  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors cursor-default">
    <div className="text-blue-500">{icon}</div>
    <span className="text-xs font-semibold text-slate-700">{name}</span>
  </div>
);

export default SystemInfo;
