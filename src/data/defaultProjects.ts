import { ProjectItem } from '../types';

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'liq-api-admin',
    title: 'Admin API',
    description: 'Developer & Admin Console para Liquid API alojada en Vercel.',
    category: 'operativa',
    url: 'https://api-liq-admin.vercel.app',
    iconName: 'Database',
    status: 'online',
    tags: ['Vercel', 'Admin API', 'Developer Console'],
    lastUpdated: 'Activo',
    isPinned: true
  },
  {
    id: 'liq-panel-netlify',
    title: 'Panel Liquidación',
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
