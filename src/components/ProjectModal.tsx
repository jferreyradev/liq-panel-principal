import React, { useState, useEffect } from 'react';
import { X, Plus, Save, Globe } from 'lucide-react';
import { ProjectItem, ProjectCategory, ProjectStatus } from '../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: ProjectItem) => void;
  editingProject?: ProjectItem | null;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingProject
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('online');
  const [tagsInput, setTagsInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingProject) {
      setTitle(editingProject.title || '');
      setDescription(editingProject.description || '');
      setUrl(editingProject.url || '');
      setStatus(editingProject.status || 'online');
      setTagsInput((editingProject.tags || []).join(', '));
      setError('');
    } else {
      setTitle('');
      setDescription('');
      setUrl('');
      setStatus('online');
      setTagsInput('Satélite, Producción');
      setError('');
    }
  }, [editingProject, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Por favor ingresa la URL del proyecto');
      return;
    }

    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    // Default title from URL if empty
    let finalTitle = title.trim();
    if (!finalTitle) {
      try {
        const parsed = new URL(finalUrl);
        finalTitle = parsed.hostname.replace('.netlify.app', '').replace('.deno.net', '');
      } catch {
        finalTitle = 'Proyecto Satélite';
      }
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const projectData: ProjectItem = {
      id: editingProject ? editingProject.id : `project-${Date.now()}`,
      title: finalTitle,
      description: description.trim() || 'Módulo y proyecto satélite del sistema de sueldos.',
      category: 'operativa' as ProjectCategory,
      url: finalUrl,
      iconName: 'Globe',
      status: status,
      tags: tags.length > 0 ? tags : ['Satélite'],
      lastUpdated: 'Reciente',
      isCustom: true
    };

    onSave(projectData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {editingProject ? 'Editar Proyecto Satélite' : 'Agregar Proyecto Satélite'}
              </h2>
              <p className="text-xs text-slate-400">
                Ingresa la URL y datos para acceder rápidamente
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error alert */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          
          {/* URL Input */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              URL del Proyecto *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://ejemplo.netlify.app o http://localhost:5173"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Nombre / Título del Proyecto
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Liq Panel o Liquid API Studio (opcional)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Descripción Corta (Opcional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Consola de administración y bridge para APIs"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Status & Tags */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="online">🟢 Activo / Online</option>
                <option value="development">🟡 En Desarrollo</option>
                <option value="planned">⚪ Planificado</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Etiquetas (separadas por comas)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Deno, API, Frontend"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/30 transition active:scale-95 cursor-pointer"
            >
              {editingProject ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{editingProject ? 'Guardar Cambios' : 'Agregar Proyecto'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
