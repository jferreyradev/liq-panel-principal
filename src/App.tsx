import React, { useState, useEffect } from 'react';
import { INITIAL_PROJECTS } from './data/defaultProjects';
import { ProjectItem } from './types';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { ProjectGrid } from './components/ProjectGrid';
import { Footer } from './components/Footer';

const STORAGE_KEY = 'sueldoshub_satellite_projects_v5';

export const App: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_PROJECTS;
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Load from disk (/api/projects) on mount
  useEffect(() => {
    fetch('/api/projects')
      .then(res => {
        if (!res.ok) throw new Error('API offline');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          } catch {
            // ignore
          }
        }
      })
      .catch(err => {
        console.warn('Reading from disk failed, using local cache:', err);
      });
  }, []);

  // Save projects to both disk and state
  const saveProjects = async (newProjects: ProjectItem[]) => {
    setProjects(newProjects);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
    } catch {
      // ignore
    }

    try {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProjects)
      });
    } catch (err) {
      console.error('Failed to persist projects to disk file projects.json:', err);
    }
  };

  const handleTogglePin = (id: string) => {
    const next = projects.map(p => p.id === id ? { ...p, isPinned: !p.isPinned } : p);
    saveProjects(next);
  };

  const handleResetDefaults = () => {
    saveProjects(INITIAL_PROJECTS);
  };

  const handleImportProjects = (imported: ProjectItem[]) => {
    saveProjects(imported);
  };

  // Search filter
  const displayedProjects = projects.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchTitle = p.title.toLowerCase().includes(q);
    const matchDesc = p.description.toLowerCase().includes(q);
    const matchTags = p.tags.some(t => t.toLowerCase().includes(q));
    const matchUrl = p.url.toLowerCase().includes(q);
    return matchTitle || matchDesc || matchTags || matchUrl;
  });

  const activeCount = projects.filter(p => p.status === 'online').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCount={activeCount}
        totalCount={projects.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Title and stats bar */}
        <StatsBar projects={projects} />

        {/* Project Grid */}
        <ProjectGrid
          projects={displayedProjects}
          onTogglePin={handleTogglePin}
        />

      </main>

      {/* Footer */}
      <Footer
        projects={projects}
        onImportProjects={handleImportProjects}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
};

export default App;
