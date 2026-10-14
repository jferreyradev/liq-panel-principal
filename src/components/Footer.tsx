import React from 'react';
import { Sparkles, Download, Upload, RotateCcw } from 'lucide-react';
import { ProjectItem } from '../types';

interface FooterProps {
  projects: ProjectItem[];
  onImportProjects: (projects: ProjectItem[]) => void;
  onResetDefaults: () => void;
}

export const Footer: React.FC<FooterProps> = ({ projects, onImportProjects, onResetDefaults }) => {
  const exportConfiguration = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sueldoshub-ecosistema-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          onImportProjects(json);
          alert('¡Configuración de proyectos importada con éxito!');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>
              <strong>SueldosHub</strong> • Ecosistema Unificado de Liquidación de Sueldos & Haberes
            </span>
          </div>

          {/* Backup & Config controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={exportConfiguration}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
              title="Descargar lista de proyectos en JSON"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Exportar JSON</span>
            </button>

            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Importar</span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>

            <button
              onClick={() => {
                if (confirm('¿Restablecer la lista de proyectos a los valores originales predeterminados?')) {
                  onResetDefaults();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-rose-400 transition"
              title="Restablecer proyectos iniciales"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer</span>
            </button>
          </div>

        </div>

        <div className="mt-6 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p>© 2026 Ecosistema Liquidación de Sueldos. Desarrollado para gestión integral de nóminas en Argentina.</p>
          <p className="flex items-center gap-1">
            Diseñado con precisión técnica y normativa laboral
          </p>
        </div>
      </div>
    </footer>
  );
};
