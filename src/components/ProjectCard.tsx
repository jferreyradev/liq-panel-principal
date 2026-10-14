import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Terminal, Edit3, Trash2, Radio, Pin } from 'lucide-react';
import { ProjectItem } from '../types';
import { DynamicIcon } from './DynamicIcon';

interface ProjectCardProps {
  project: ProjectItem;
  onEdit?: (p: ProjectItem) => void;
  onDelete?: (id: string) => void;
  onTogglePin?: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete, onTogglePin }) => {
  const [copied, setCopied] = useState(false);
  const [pingStatus, setPingStatus] = useState<'idle' | 'checking' | 'ok' | 'failed'>('idle');

  const copyUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(project.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePing = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setPingStatus('checking');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      await fetch(project.url, { mode: 'no-cors', signal: controller.signal });
      clearTimeout(timeoutId);
      setPingStatus('ok');
    } catch {
      setPingStatus('failed');
    }
    setTimeout(() => setPingStatus('idle'), 4000);
  };

  const statusConfig = {
    online: {
      label: 'Activo / Online',
      dotColor: 'bg-emerald-400',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    development: {
      label: 'En Desarrollo',
      dotColor: 'bg-amber-400',
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    },
    maintenance: {
      label: 'Mantenimiento',
      dotColor: 'bg-rose-400',
      badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    },
    planned: {
      label: 'Planificado',
      dotColor: 'bg-slate-400',
      badgeClass: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }
  }[project.status];

  return (
    <div className={`group relative bg-slate-900/80 hover:bg-slate-900 border rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between shadow-lg ${
      project.isPinned 
        ? 'border-indigo-500/60 shadow-indigo-500/15 ring-1 ring-indigo-500/30' 
        : 'border-slate-800 hover:border-indigo-500/40 hover:shadow-indigo-500/10'
    }`}>
      
      {/* Top row: Icon, Category & Actions */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-indigo-400 group-hover:scale-105 group-hover:border-indigo-500/40 group-hover:text-indigo-300 transition shadow-inner">
            <DynamicIcon name={project.iconName} className="w-6 h-6" />
          </div>

          <div className="flex items-center gap-1.5">
            {/* Pinned badge */}
            {project.isPinned && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Pin className="w-3 h-3 fill-amber-300 rotate-45" />
                <span>Fijado</span>
              </span>
            )}

            {/* Status badge */}
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${statusConfig.badgeClass}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor} ${project.status === 'online' ? 'animate-pulse' : ''}`} />
              {statusConfig.label}
            </span>

            {/* Pin Toggle action */}
            {onTogglePin && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onTogglePin(project.id); }}
                title={project.isPinned ? 'Desfijar proyecto' : 'Fijar proyecto al inicio'}
                className={`p-1.5 rounded-lg transition ${
                  project.isPinned 
                    ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Pin className={`w-3.5 h-3.5 ${project.isPinned ? 'fill-current rotate-45' : ''}`} />
              </button>
            )}

            {/* Edit action */}
            {onEdit && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onEdit(project); }}
                title="Editar configuración"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Delete action */}
            {onDelete && project.isCustom && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
                title="Eliminar proyecto"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition line-clamp-1">
          {project.title}
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-xs text-slate-400 leading-relaxed line-clamp-2 min-h-[2rem]">
          {project.description}
        </p>

        {/* URL / Port indicator */}
        <div className="mt-3.5 flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800/80 font-mono">
          <Terminal className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          <span className="truncate flex-1 text-slate-300">{project.url}</span>
          
          <button
            type="button"
            onClick={copyUrl}
            title="Copiar URL"
            className="text-slate-400 hover:text-white transition flex-shrink-0 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/50"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
        {/* Ping / Connection Tester */}
        <button
          type="button"
          onClick={handlePing}
          disabled={pingStatus === 'checking'}
          className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg border transition cursor-pointer ${
            pingStatus === 'ok'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : pingStatus === 'failed'
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              : 'text-slate-400 hover:text-slate-200 bg-slate-800/40 hover:bg-slate-800 border-slate-800'
          }`}
          title="Verificar si el puerto o URL está respondiendo"
        >
          <Radio className={`w-3 h-3 ${pingStatus === 'checking' ? 'animate-spin text-indigo-400' : ''}`} />
          <span>
            {pingStatus === 'checking' && 'Probando...'}
            {pingStatus === 'ok' && 'En línea'}
            {pingStatus === 'failed' && 'Sin respuesta'}
            {pingStatus === 'idle' && 'Test Conexión'}
          </span>
        </button>

        {/* Launch project button */}
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition active:scale-95"
        >
          <span>Abrir Módulo</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
};
