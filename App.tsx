
import React, { useState, useMemo, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ModelOverview from './components/ModelOverview';
import DatasetExplorer from './components/DatasetExplorer';
import PredictionDashboard from './components/PredictionDashboard';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import SystemInfo from './components/SystemInfo';
import { ViewType, EngineData, SummaryMetrics } from './types';
import { generateMockEngines, calculateSummary } from './utils/dataGenerators';
import { parseCMAPSSFile } from './utils/dataParser';
import { Bell, Search, Upload, FileText, CheckCircle2, X, Info, Zap, LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.OVERVIEW);
  // Initial state is empty as requested
  const [engines, setEngines] = useState<EngineData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; subtext?: string; show: boolean }>({ message: '', show: false });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const metrics: SummaryMetrics | null = useMemo(() => {
    return engines.length > 0 ? calculateSummary(engines) : null;
  }, [engines]);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const parsedEngines = parseCMAPSSFile(content);
        if (parsedEngines.length > 0) {
          setEngines(parsedEngines);
          setCurrentView(ViewType.OVERVIEW);
          setToast({
            message: "Success: File Processed",
            subtext: `LSTM logic analyzed ${parsedEngines.length} engines successfully.`,
            show: true
          });
        } else {
          alert("Invalid file structure. Please upload a CMAPSS-compatible dataset.");
        }
      } catch (err) {
        alert("Critical error parsing file.");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    setEngines([]);
    setToast({ message: "System Cleared", show: true });
  };

  const loadDemo = () => {
    setEngines(generateMockEngines(50));
    setToast({ message: "Demo Data Loaded", show: true });
  };

  const isDataLoaded = engines.length > 0;

  const renderContent = () => {
    if (!isDataLoaded) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white border-2 border-dashed border-slate-200 rounded-3xl animate-in fade-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 animate-pulse ring-8 ring-blue-50/50">
            <Upload size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">JetSense Terminal Ready</h2>
          <p className="text-slate-500 max-w-md mb-8">
            Upload your turbofan telemetry logs (CMAPSS format) to generate Remaining Useful Life predictions via our LSTM inference engine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95"
            >
              Upload Dataset
            </button>
            <button 
              onClick={loadDemo}
              className="px-10 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all"
            >
              Use Demo Data
            </button>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case ViewType.OVERVIEW:
        return <ModelOverview metrics={metrics!} engines={engines} />;
      case ViewType.DATASET:
        return <DatasetExplorer engines={engines} />;
      case ViewType.PREDICTIONS:
        return <PredictionDashboard engines={engines} />;
      case ViewType.ANALYTICS:
        return <AdvancedAnalytics engines={engines} />;
      case ViewType.INFO:
        return <SystemInfo />;
      default:
        return <ModelOverview metrics={metrics!} engines={engines} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Fix: Call setCurrentView in the setView prop and avoid shadowing the parameter name */}
      <Sidebar currentView={currentView} setView={view => isDataLoaded && setCurrentView(view)} />
      
      <main className="flex-1 ml-64 p-8 transition-all duration-300">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-2">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">JetSense ML</span>
             {isDataLoaded && (
               <>
                 <span className="text-slate-300">/</span>
                 <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{currentView.replace('-', ' ')}</span>
               </>
             )}
           </div>
           
           <div className="flex items-center gap-6">
             <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".txt,.csv" />
             <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className={`group flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:opacity-50 shadow-lg ${
                isDataLoaded 
                ? 'bg-white border border-blue-200 text-blue-600 hover:bg-blue-50' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 ring-4 ring-blue-100 animate-bounce'
              }`}
             >
               {isUploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Upload size={18} />}
               {isUploading ? 'Analyzing...' : 'Upload Dataset'}
             </button>

             <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
               <div className="text-right">
                 <p className="text-xs font-bold text-slate-900">Research Terminal</p>
                 <p className="text-[10px] text-emerald-500 font-bold flex items-center justify-end gap-1">
                   <CheckCircle2 size={10} /> {isDataLoaded ? 'Active' : 'Standby'}
                 </p>
               </div>
               <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm border-2 border-blue-200">
                 RT
               </div>
             </div>
           </div>
        </div>

        {toast.show && (
          <div className="fixed top-8 right-8 z-[100] animate-in slide-in-from-right-8 fade-in duration-300">
            <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 flex items-start gap-4 min-w-[320px]">
              <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
                <CheckCircle2 size={24} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900">{toast.message}</h4>
                {toast.subtext && <p className="text-xs text-slate-500 mt-1">{toast.subtext}</p>}
              </div>
              <button onClick={() => setToast(prev => ({ ...prev, show: false }))} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {isDataLoaded && (
          <div className="mb-8 p-4 bg-blue-900 rounded-2xl shadow-xl flex items-center justify-between text-white overflow-hidden relative">
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                <Zap className="text-blue-200 fill-current" size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight">Dataset Analysis Active</h3>
                <p className="text-xs text-blue-200 mt-0.5 opacity-80">
                  Model RUL inference calculated for {engines.length} assets based on sensor telemetry.
                </p>
              </div>
            </div>
            <div className="relative z-10">
              <button 
                onClick={handleReset}
                className="px-4 py-2 bg-white/10 hover:bg-rose-500/30 border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Clear Data
              </button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-blue-500/20 to-transparent pointer-events-none" />
          </div>
        )}

        <div className="max-w-[1400px] mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
