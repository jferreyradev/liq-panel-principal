# 💼 SueldosHub — Panel Principal del Ecosistema de Liquidación de Sueldos

> **Suite Integral & Centro de Control para la Gestión de Nóminas, Normativa Laboral y AFIP en Argentina.**

Este proyecto actúa como la **Landing Page y Panel Principal (Hub)** para centralizar, orquestar y acceder a todos los módulos y microservicios relacionados con la liquidación de haberes.

---

## 🚀 Características Principales

1. **Dashboard y Lanzador de Aplicaciones**:
   - Catálogo clasificado por áreas: *Operativa & Cálculo*, *Normativa & AFIP*, *Gestión & Empleados*, *Costos & Reportes* y *Mis Proyectos*.
   - Accesos directos a puertos locales (e.g. `:5174`, `:5175`, `:5176`) y servidores remotos.
   - Indicador de estado en tiempo real con herramienta de **Ping / Test de Conexión**.

2. **Vinculación Dinámica de Proyectos**:
   - Permite vincular cualquier proyecto local o repositorio nuevo mediante un modal interactivo.
   - Persistencia automática en `localStorage` con soporte para **Exportar / Importar en JSON** y restaurar valores por defecto.

3. **Herramientas de Liquidación Embebidas**:
   - **Simulador de Sueldo Bruto a Neto (LCT 20.744)**: Cálculo instantáneo de aportes de ley (Jubilación 11%, INSSJyP 3%, Obra Social 3%, Cuota Sindical) y costo empleador (cargas patronales).
   - **Calendario de Vencimientos Laborales y Previsionales**: Plazos legales de pago de haberes (4to día hábil), Libro de Sueldos Digital AFIP, presentación de DDJJ F.931 y SAC (aguinaldo).

4. **Arquitectura Modular**:
   - Convención sugerida de puertos y microfrontends para escalar el ecosistema.
   - Diseñado con React 19, TypeScript, Vite y Tailwind CSS v4.

---

## 🛠️ Módulos Iniciales del Ecosistema

| Módulo | Puerto Sugerido | Descripción |
| :--- | :---: | :--- |
| **Motor de Liquidación & Haberes** | `5174` | Liquidación mensual/quincenal, conceptos remunerativos y no remunerativos. |
| **Libro de Sueldos Digital (AFIP / F.931)** | `5175` | Validación de topes imponibles y generación de archivos TXT LSD. |
| **Recibos de Sueldo Digitales** | `5176` | Distribución, visualización y firma electrónica de recibos en PDF. |
| **Gestor de CCT & Escalas Salariales** | `5177` | Parametrización de convenios (Comercio, UOCRA, etc.) y paritarias. |
| **Control de Novedades & Ausentismo** | `5178` | Registro de horas extras (50% y 100%), licencias y faltas. |
| **Simulador Ganancias 4ta Categoría** | `5179` | Retención de impuesto a los ingresos personales y SIRADIG F.572. |
| **Costos Laborales & Asiento Contable** | `5180` | Minuta contable, provisión de SAC/vacaciones y cargas patronales. |
| **Certificaciones de Servicios (Art. 80)** | `5181` | Emisión de certificados de trabajo ante desvinculaciones. |

---

## 💻 Puesta en Marcha

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o pnpm

### Ejecución en Modo Desarrollo
```bash
npm install
npm run dev
```
El panel estará disponible en: **[http://localhost:3000](http://localhost:3000)**

### Compilación para Producción
```bash
npm run build
npm run preview
```

---

## 📂 Estructura del Código

```text
liq-panel-principal/
├── src/
│   ├── components/
│   │   ├── ArchitectureGuide.tsx    # Guía de integración del ecosistema
│   │   ├── CalendarModal.tsx        # Calendario de vencimientos laborales y AFIP
│   │   ├── DynamicIcon.tsx          # Renderizado dinámico de iconos Lucide
│   │   ├── Footer.tsx               # Pie de página y backup JSON
│   │   ├── Header.tsx               # Barra superior con buscador y accesos
│   │   ├── ProjectCard.tsx          # Tarjeta individual con ping y acciones
│   │   ├── ProjectGrid.tsx          # Filtros por categorías y estado
│   │   ├── ProjectModal.tsx         # Modal para vincular/editar proyectos
│   │   ├── QuickCalculatorModal.tsx # Simulador rápido Bruto a Neto
│   │   └── StatsBar.tsx             # Banner de bienvenida y métricas clave
│   ├── data/
│   │   └── defaultProjects.ts       # Módulos iniciales de referencia
│   ├── types/
│   │   └── index.ts                 # Tipos TypeScript para el ecosistema
│   ├── App.tsx                      # Componente principal con persistencia
│   ├── index.css                    # Estilos Tailwind v4
│   └── main.tsx                     # Punto de entrada de React
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```
