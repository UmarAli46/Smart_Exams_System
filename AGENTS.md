# Project Guidelines — AMIS UI Enterprise Standards

When working in this project, follow the **AMIS UI Enterprise React Agent Specification** (`amis-ui-agent.md`).

## Core Rules & System Architecture

1. **Stack**: React 19, Vite 7, TypeScript 5.9, Material-UI (MUI v7), Redux Toolkit, Redux Saga, React Hook Form, Zod.
2. **Typography**: Header Branding $\rightarrow$ `Montserrat, sans-serif` | Controls/Body $\rightarrow$ `Outfit, sans-serif`.
3. **Data Flow**: Component $\rightarrow$ Slice Dispatch $\rightarrow$ Saga Side Effect $\rightarrow$ API Service (`src/api/API.tsx`) $\rightarrow$ Backend API $\rightarrow$ Slice Success/Error State $\rightarrow$ Re-render.
4. **Safety**: Wrap all API array responses with `ensureArray<T>()` (`src/lib/safeArray.ts`).
5. **Z-Index Layering**: Main Sidebar (`1301`), MuiDialog (`1400`), MuiPopover/Popper (`1500`), MuiTooltip (`1600`).
6. **Reusable Grids**:
   - Master Catalog/List pages: `GlobalDynamicGrid` (`src/component/customgrid/GlobalDynamicGrid.tsx`)
   - Master-Detail Line-Item transaction tables: `EditableDataGrid` (`src/component/customgrid/editableGrid.tsx`)
