import React from 'react';
import { Globe } from 'lucide-react';
import { ProjectItem } from '../types';

interface StatsBarProps {
  projects: ProjectItem[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ projects }) => {
  const onlineCount = projects.filter(p => p.status === 'online').length;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-slate-800">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Globe className="w-6 h-6 text-indigo-400" />
          <span>Proyectos Satélite</span>
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          Centro de acceso directo a todos los módulos y sistemas de liquidación de sueldo.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl">
          <span className="text-white font-bold">{projects.length}</span> {projects.length === 1 ? 'proyecto registrado' : 'proyectos registrados'} ({onlineCount} en línea)
        </div>
      </div>
    </div>
  );
};
