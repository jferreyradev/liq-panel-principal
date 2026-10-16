import { ProjectItem } from '../types';

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'liq-api-studio',
    title: 'Liquid Studio',
    description: 'Developer & Multi-Host Console para Liquid API alojado en Netlify.',
    category: 'operativa',
    url: 'https://liqapistudio.netlify.app/',
    iconName: 'Database',
    status: 'online',
    tags: ['Netlify', 'Liquid Studio', 'Developer Console'],
    lastUpdated: 'Activo',
    isPinned: true
  },
  {
    id: 'liq-panel-netlify',
    title: 'Liq Panel',
    description: 'Panel y módulo satélite de liquidación de sueldos alojado en Netlify.',
    category: 'operativa',
    url: 'https://liqpanel.netlify.app',
    iconName: 'Calculator',
    status: 'online',
    tags: ['Netlify', 'Producción', 'Frontend'],
    lastUpdated: 'Activo'
  },
  {
    id: 'kv-admin',
    title: 'KV Storage Admin',
    description: 'Gestión centralizada de colecciones Deno KV, backends dinámicos, IPs de servidores y configuraciones municipales.',
    category: 'operativa',
    url: 'https://kv-admin.jferreyradev.deno.net',
    port: 8000,
    iconName: 'Globe',
    status: 'online',
    tags: ['Deno KV', 'Config Hub', 'Infraestructura'],
    lastUpdated: 'Activo',
    repositoryUrl: 'https://github.com/jferreyradev/kv-admin.git'
  }
];
