import React, { useState } from 'react';
import { Plus, Link as LinkIcon } from 'lucide-react';
import { ProjectItem } from '../types';

interface QuickAddBarProps {
  onAddProject: (project: ProjectItem) => void;
}

export const QuickAddBar: React.FC<QuickAddBarProps> = ({ onAddProject }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    let finalTitle = title.trim();
    if (!finalTitle) {
      try {
        const parsed = new URL(finalUrl);
        finalTitle = parsed.hostname.replace('.netlify.app', '').replace('.deno.net', '').replace('.vercel.app', '');
      } catch {
        finalTitle = 'Proyecto Satélite';
      }
    }

    const newProject: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: finalTitle,
      description: 'Proyecto satélite del ecosistema.',
      category: 'operativa',
      url: finalUrl,
      iconName: 'Globe',
      status: 'online',
      tags: ['Satélite', 'Web'],
      lastUpdated: 'Reciente',
      isCustom: true
    };

    onAddProject(newProject);
    setUrl('');
    setTitle('');
    setStatusMsg(`¡"${finalTitle}" agregado con éxito!`);
    setTimeout(() => setStatusMsg(''), 3000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-lg">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
            Agregar Proyecto Satélite Rápido
          </h2>
        </div>
        {statusMsg && (
          <span className="text-xs text-emerald-400 font-medium animate-pulse">
            {statusMsg}
          </span>
        )}
      </div>

      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2.5">
        <input
          type="text"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL del proyecto (ej: https://mi-proyecto.netlify.app)"
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
        />

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nombre (opcional)"
          className="sm:w-56 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />

        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Proyecto</span>
        </button>
      </form>
    </div>
  );
};
