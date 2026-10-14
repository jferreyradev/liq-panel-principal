export type ProjectCategory = 
  | 'operativa' 
  | 'normativa' 
  | 'gestion' 
  | 'reportes' 
  | 'mis-proyectos';

export type ProjectStatus = 'online' | 'development' | 'maintenance' | 'planned';

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  url: string;
  port?: number | string;
  iconName: string;
  status: ProjectStatus;
  tags: string[];
  lastUpdated?: string;
  repositoryUrl?: string;
  isCustom?: boolean;
  isPinned?: boolean;
}

export interface PayrollQuickCalculation {
  bruto: number;
  jubilacion: number; // 11%
  ley19032: number;   // 3%
  obraSocial: number; // 3%
  sindicatoPorc: number;
  sindicatoMonto: number;
  otrosDescuentos: number;
  noRemunerativo: number;
  neto: number;
  cargasPatronales: number; // ~24%
  costoTotalEmpresa: number;
}
