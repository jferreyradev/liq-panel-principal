import React from 'react';
import { ProjectItem } from '../types';
import { ProjectCard } from './ProjectCard';
import { Globe } from 'lucide-react';

interface ProjectGridProps {
  projects: ProjectItem[];
  onEditProject?: (project: ProjectItem) => void;
  onDeleteProject?: (id: string) => void;
  onTogglePin?: (id: string) => void;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  onEditProject,
  onDeleteProject,
  onTogglePin
}) => {
  // Pinned projects appear first
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <div className="space-y-6">
      {sortedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={onEditProject}
              onDelete={onDeleteProject}
              onTogglePin={onTogglePin}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-slate-800 bg-slate-900/30">
          <Globe className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No hay proyectos satélite registrados</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Los proyectos satélite configurados se mostrarán aquí.
          </p>
        </div>
      )}
    </div>
  );
};
