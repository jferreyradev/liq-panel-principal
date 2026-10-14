import { ProjectItem } from '../types';

export const INITIAL_PROJECTS: ProjectItem[] = [
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
    id: 'dno-admin-bridge',
    title: 'Liquid API Studio',
    description: 'Consola de administración y bridge para Liquid API desplegado en Deno.',
    category: 'operativa',
    url: 'https://dno-admin-bridge.jferreyradev.deno.net',
    iconName: 'Database',
    status: 'online',
    tags: ['Deno', 'API Studio', 'Admin Bridge'],
    lastUpdated: 'Activo'
  },
  {
    id: 'dev-admin',
    title: 'Dev Admin',
    description: 'Consola técnica de administración, ejecución de queries SQL libres, procedimientos Oracle US_SUELDO y switch de backends.',
    category: 'operativa',
    url: 'http://localhost:5173',
    port: 5173,
    iconName: 'Terminal',
    status: 'online',
    tags: ['Vue 3', 'SQL Runner', 'Oracle', 'Proxy Hono'],
    lastUpdated: 'Activo',
    repositoryUrl: 'https://github.com/jferreyradev/dev-admin.git'
  },
  {
    id: 'kv-admin',
    title: 'KV Storage Admin',
    description: 'Gestión centralizada de colecciones Deno KV, backends dinámicos, IPs de servidores y configuraciones municipales.',
    category: 'operativa',
    url: 'https://kv-admin.jferreyradev.deno.net',
    port: 8000,
    iconName: 'Server',
    status: 'online',
    tags: ['Deno KV', 'Config Hub', 'Infraestructura', 'Cloudflare Access'],
    lastUpdated: 'Activo',
    repositoryUrl: 'https://github.com/jferreyradev/kv-admin.git'
  }
];
