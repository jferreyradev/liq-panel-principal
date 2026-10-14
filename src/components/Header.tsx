import React from 'react';
import { Search, Sparkles, Activity } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeCount: number;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  activeCount,
  totalCount
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border-2 border-slate-950"></span>
              </span>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white">
                  Sueldos<span className="text-indigo-400">Hub</span>
                </span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Lanzador
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Acceso a proyectos satélite de liquidación de haberes
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-sm hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar proyecto satélite..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>{activeCount} de {totalCount} activos</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
