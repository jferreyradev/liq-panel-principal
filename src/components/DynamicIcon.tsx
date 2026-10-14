import React from 'react';
import {
  Calculator,
  FileCheck,
  FileText,
  Scale,
  CalendarCheck2,
  Coins,
  BarChart3,
  Award,
  Layers,
  FolderGit2,
  Globe,
  Settings,
  ShieldCheck,
  Briefcase,
  Users,
  Database,
  LucideIcon
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Calculator,
  FileCheck,
  FileText,
  Scale,
  CalendarCheck2,
  Coins,
  BarChart3,
  Award,
  Layers,
  FolderGit2,
  Globe,
  Settings,
  ShieldCheck,
  Briefcase,
  Users,
  Database
};

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-5 h-5', size }) => {
  const IconComponent = ICON_MAP[name] || Layers;
  return <IconComponent className={className} size={size} />;
};

export const AVAILABLE_ICONS = Object.keys(ICON_MAP);
