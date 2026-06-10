# Prompt v2: POC — Sistema de Gestión de Consultorios Médicos
## Con Ramp Design System + Dark/Light Toggle

---

Construí una aplicación web completa en **React + TypeScript**. Es una **POC de un SaaS de gestión para consultorios médicos privados argentinos**. Todos los datos son hardcodeados — no hay backend ni base de datos. El objetivo es una demo que se vea terminada y profesional para mostrar a médicos.

---

## Stack

- React 18 + TypeScript
- Tailwind CSS (CDN o inline)
- Lucide React para íconos
- Recharts para gráficos
- date-fns para fechas
- Todo estado local con useState / useReducer

---

## Sistema de diseño — RAMP (seguir estrictamente)

Aplicar el siguiente sistema de diseño extraído de ramp.com. Es un dark theme de alta precisión, inspirado en un panel de control financiero. Usarlo como base y adaptarlo al contexto médico.

### Tema por defecto: DARK
Implementar toggle dark/light visible en el header (ícono luna/sol). Persistir preferencia en localStorage. Ambos temas completamente funcionales en todos los módulos.

### Paleta de colores

**DARK MODE:**
```css
--bg-canvas: #0c0a08;           /* Deep Space Black — fondo principal */
--bg-card: #1a1919;             /* Ash Gray — cards elevadas */
--bg-card-deep: #0b0d1b;        /* Ocean Abyss — cards interactivas */
--text-primary: #ffffff;         /* Pure White — texto principal */
--text-secondary: #999ba3;       /* Slate Gray — texto secundario, placeholders */
--border: #4d505d;               /* Iron Gray — bordes de inputs y cards */
--border-subtle: rgba(255,255,255,0.08); /* bordes muy sutiles */
--accent-yellow: #e4f222;        /* Sunbeam Yellow — CTA primario, nav activo */
--accent-green: #00d638;         /* Emerald Green — éxito, positivo */
--accent-blue: #5683d2;          /* Deep Sea Blue — links, info */
--accent-orange: #ff492c;        /* Blaze Orange — alertas, cancelados */
--shadow: rgba(255,255,255,0.6) 0px 0px 2px 0px inset;
```

**LIGHT MODE:**
```css
--bg-canvas: #f4f2f0;           /* Ivory White */
--bg-card: #ffffff;
--bg-card-deep: #f0eeec;
--text-primary: #0c0a08;
--text-secondary: #666460;
--border: #d2cecb;               /* Silver Mist */
--border-subtle: rgba(0,0,0,0.08);
--accent-yellow: #b8c100;        /* amarillo oscurecido para legibilidad en light */
--accent-green: #00a82c;
--accent-blue: #3d62b0;
--accent-orange: #d63000;
```

### Tipografía
- Font principal: Inter (Google Fonts, fallback system-ui sans-serif)
- Pesos: 400 (regular) y 500 (medium) únicamente — nunca 600 ni 700
- Escala: 10px caption, 12px small, 13px body-sm, 14px body, 16px subheading, 18px heading-sm, 24px heading, 40px display
- Letter spacing: -0.01em en headings para sensación premium
- Números y datos financieros: font-variant-numeric: tabular-nums

### Espaciado (base 4px)
- Gap entre elementos: 8px
- Padding de cards: 24px
- Gap entre secciones: 24px
- Sidebar width: 52px (colapsada con íconos) / 220px (expandida)

### Border radius
- Cards y contenedores grandes: 12px
- Inputs: 10px
- Botones: 4px (sharp — característica de Ramp)
- Badges / pills: 999px
- Nav items: 4px

### Botones
- **Primario**: fondo `--accent-yellow`, texto `--bg-canvas`, border-radius 4px, padding 10px 20px, font-weight 500
- **Secundario**: fondo transparente, borde 1px `--border`, texto `--text-primary`, mismas dimensiones
- **Ghost/texto**: sin fondo ni borde, texto `--accent-blue`
- **Destructivo**: fondo transparente, borde `--accent-orange`, texto `--accent-orange`

### Cards
- Fondo: `--bg-card`
- Border: 1px solid `--border-subtle`
- Border-radius: 12px
- Padding: 24px
- Sin sombras externas — la profundidad se comunica con diferencia de superficie

### Estados de badges médicos
- Confirmado: fondo verde 15% opacidad, texto `--accent-green`
- En consultorio: fondo amarillo 15% opacidad, texto `--accent-yellow`
- Pendiente: fondo azul 15% opacidad, texto `--accent-blue`
- Cancelado: fondo naranja 15% opacidad, texto `--accent-orange`

---

## Diseño y UX

- Sidebar fija izquierda, colapsada por defecto (solo íconos 52px), expandible al hover o click con label
- Header: 48px alto, nombre del consultorio, fecha de hoy, toggle dark/light, avatar del médico con iniciales
- Transiciones suaves (150ms ease) en hover, navegación y apertura de modales
- Modales con overlay oscuro, centrados, máximo 560px ancho, cerrar con ESC o click fuera
- Toasts de confirmación (3 segundos) en acciones: nuevo turno, receta emitida, cobro registrado
- Todo en **español argentino** — "turno" no "cita", "obra social" no "seguro médico"
- Animaciones mínimas: fade-in en navegación entre módulos (100ms)
- Scrollbar personalizada: 4px, color `--border`, redondeada

---

## Módulos (todos navegables desde sidebar)

### 1. Dashboard — ícono: LayoutDashboard

Vista del día. Contiene:

**4 metric cards** en fila (fondo `--bg-card-deep`):
- Turnos hoy: **9** (7 confirmados · 2 pendientes)
- Cobrado hoy: **$74.000** (3 pendientes)
- Nuevos este mes: **18** pacientes
- Próximo turno: **10:30** — en 12 min

**Agenda del día** (columna izquierda, 60% ancho):
Lista de turnos con: hora, avatar con iniciales del paciente, nombre, motivo, obra social, badge de estado. Al hacer click abre drawer lateral con detalle del paciente.

**Panel derecho** (40% ancho):
- Cobros del día con montos y estado
- Alertas: WhatsApp enviado, cancelación recibida, receta por vencer
- Mini gráfico de barras Recharts: turnos por día de la semana (lun-vie), acento `--accent-yellow`

---

### 2. Agenda — ícono: Calendar

Toggle Día / Semana en header del módulo.

**Vista diaria**: timeline 08:00–20:00. Cada franja de 30min. Los turnos son bloques de color según estado ocupando el espacio proporcional a su duración.

**Vista semanal**: grilla 5 columnas (lun-vie), cada celda = 30min. Turnos como bloques compactos con nombre y hora.

**Nuevo turno** (botón primario amarillo en header): modal con campos: paciente (dropdown + opción "Nuevo paciente"), fecha, hora, duración (15/30/45/60), motivo, obra social. Al confirmar agrega al estado y muestra toast.

**Click en turno**: drawer derecho con nombre, motivo, obra social, historial resumido (últimas 3 consultas), botones: "Iniciar consulta", "Reprogramar", "Cancelar".

---

### 3. Pacientes — ícono: Users

**Header**: buscador en tiempo real (nombre, DNI, obra social) + botón "Nuevo paciente".

**Lista**: tabla con columnas: avatar+nombre, edad, obra social, última consulta, total consultas, acción (ver ficha). Ordenable por nombre y fecha.

**Ficha de paciente** (abre en panel o modal grande):
- Header: avatar grande con iniciales, nombre, edad, obra social, teléfono, email
- Tabs: Historia Clínica | Recetas | Cobros | Datos Personales
- Historia clínica: timeline vertical, cada consulta con fecha, motivo, diagnóstico, notas, indicaciones
- Botones flotantes: "Nueva consulta", "Nueva receta"

---

### 4. Recetas — ícono: FileText

**Lista de recetas**: fecha, paciente, medicamentos (resumidos), estado badge (Vigente / Vencida).

**Sección "Crónicas"**: pacientes con medicación mensual recurrente. Botón "Renovar" que genera la receta con 1 click y muestra preview.

**Nueva receta** (modal):
- Selector de paciente
- Hasta 3 medicamentos: nombre comercial, principio activo, dosis, posología, duración
- Indicaciones adicionales
- Preview de receta con membrete: nombre médico, matrícula, consultorio, fecha, datos del paciente, medicamentos formateados, firma (texto)
- Botón "Emitir" agrega al estado

---

### 5. Facturación — ícono: DollarSign

**Header metrics**:
- Total cobrado mes: $412.000
- Pendiente: $48.000
- Consultas: 28
- Ticket promedio: $14.714

**Gráfico de línea** (Recharts, color `--accent-yellow`): ingresos diarios últimos 30 días.

**Gráfico de torta** (Recharts): distribución por obra social.
Colores: OSDE #5683d2, Swiss Medical #00d638, Galeno #e4f222, IOMA #999ba3, Particular #ff492c.

**Tabla de movimientos**: fecha, paciente, obra social, monto, estado. Filtros por estado. Botón "Marcar cobrado" en pendientes (actualiza estado en tiempo real).

**Liquidaciones obras sociales**: tabla con OS, consultas del mes, monto, estado liquidación (Presentada/Cobrada/Pendiente).

---

### 6. Historia Clínica — ícono: ClipboardList

**Lista global** de consultas cronológica (más reciente primero). Cada fila: fecha, paciente, diagnóstico principal, indicaciones (truncado).

**Buscador** por paciente o diagnóstico.

**Click en consulta**: modal con detalle completo y opción de editar notas (edición inline con botón guardar).

**Nueva consulta** (botón primario): modal con campos:
- Selector paciente
- Motivo de consulta
- Anamnesis (textarea)
- Examen físico: TA (ej: 120/80), FC, Temperatura, Peso, Talla — en grid 2x3
- Diagnóstico (texto libre + campo opcional código CIE-10)
- Plan e indicaciones
- Próximo control (fecha)

---

### 7. Estadísticas — ícono: BarChart2

**Selector período**: Semana / Mes / Trimestre / Año (cambia todos los datos)

**5 métricas**: total consultas, pacientes únicos, tasa ausentismo (%), nuevos pacientes, ingresos.

**Gráfico barras** (Recharts): consultas por día de semana, pico martes-jueves.

**Gráfico línea** (Recharts): ingresos últimos 6 meses con tendencia creciente suave.

**Top 5 diagnósticos**: lista con barra de progreso horizontal, color `--accent-blue`:
1. Hipertensión arterial — 34%
2. Control sano adulto — 22%
3. Diabetes tipo 2 — 18%
4. Lumbalgia — 14%
5. Rinitis alérgica — 12%

**Mapa de calor horario** (grid 5x12): días lunes-viernes, horas 8-20. Celdas coloreadas por intensidad usando opacidades del `--accent-yellow`. Picos visibles: mar/jue 10hs y 17hs.

---

### 8. Configuración — ícono: Settings

Tabs: Consultorio | Médico | Agenda | Notificaciones | Plan

- **Consultorio**: nombre, dirección, teléfono, especialidad, logo (botón upload simulado)
- **Médico**: nombre, matrícula nacional, matrícula provincial, especialidad, firma (texto simulado en cursiva)
- **Agenda**: duración default de consulta (selector), horarios de atención (grilla semanal con celdas on/off), buffer entre turnos
- **Notificaciones**: toggles — WhatsApp recordatorio (on por defecto), cuántas horas antes (selector 12/24/48hs), recordatorio de seguimiento
- **Plan**: card con "Plan Básico · $29 USD/mes", fecha próximo cobro, botón "Ver planes" (modal con tabla comparativa Básico/Pro/Clínica)

---

## Datos hardcodeados — exactos

### Médico / Consultorio
- Médica: Dra. María García | Clínica Médica | Mat. Nac. 98.765 | Mat. Prov. BA-12345
- Consultorio: Centro Médico Belgrano | Av. Cabildo 1425 Piso 2 Of. 8, CABA | Tel: 11-4789-3300

### 10 Pacientes
| # | Nombre | Edad | DNI | Obra Social | Antecedentes | Tel |
|---|--------|------|-----|-------------|--------------|-----|
| 1 | Juan Ramírez | 54 | 18.432.876 | OSDE 210 | HTA + DBT2 | 11-4523-8876 |
| 2 | María López | 38 | 28.765.432 | Swiss Medical | Sin antecedentes | 11-5678-9012 |
| 3 | Carlos Torres | 67 | 10.234.567 | IOMA | Cardiopatía isquémica | 11-3456-7890 |
| 4 | Ana Martínez | 29 | 35.678.901 | Galeno | Lumbalgia crónica | 11-6789-0123 |
| 5 | Roberto Sánchez | 45 | 22.345.678 | Particular | Alergia penicilina | 11-7890-1234 |
| 6 | Laura Fernández | 33 | 31.234.567 | OSDE 310 | Hipotiroidismo | 11-2345-6789 |
| 7 | Pedro Rodríguez | 71 | 8.567.890 | PAMI | HTA + Artrosis | 11-8901-2345 |
| 8 | Sofía Herrera | 25 | 40.123.456 | Swiss Medical | Sin antecedentes | 11-9012-3456 |
| 9 | Diego Morales | 48 | 20.987.654 | Galeno | DBT2 | 11-0123-4567 |
| 10 | Valeria Castro | 41 | 26.543.210 | OSDE 210 | Migraña crónica | 11-1234-5678 |

### Turnos del día (miércoles 11/06/2026)
| Hora | Paciente | Motivo | Estado |
|------|----------|--------|--------|
| 08:30 | Pedro Rodríguez | Control PAMI | Confirmado |
| 09:00 | Sofía Herrera | Primera consulta | Confirmado |
| 09:30 | Diego Morales | Control diabetes | En consultorio |
| 10:00 | Valeria Castro | Cefalea intensa | Confirmado |
| 10:30 | Juan Ramírez | Control HTA | Confirmado |
| 11:00 | María López | Primera consulta | Pendiente |
| 11:30 | Carlos Torres | Resultados laboratorio | Confirmado |
| 12:00 | Ana Martínez | Dolor lumbar | Confirmado |
| 12:30 | Roberto Sánchez | Renovación receta | Cancelado |
| 17:00 | Laura Fernández | Control tiroides | Confirmado |
| 17:30 | Pedro Rodríguez | Sobreturno análisis | Pendiente |

### Historia clínica de Juan Ramírez (mínimo 4 consultas)
1. **03/06/2026** — Control HTA: TA 145/90, FC 78. Ajuste de amlodipina a 10mg. Próximo control 3 meses.
2. **15/03/2026** — Control HTA + DBT: glucemia 142 mg/dl, TA 138/85. Agrega metformina 850mg. Solicita HbA1c + perfil lipídico.
3. **20/01/2026** — Control anual: todo dentro de parámetros. Renueva tratamiento crónico.
4. **08/10/2025** — Dolor precordial atípico: ECG normal, descarta cardiopatía aguda. Deriva a cardiología preventiva.

### Recetas activas (mínimo 6)
1. Juan Ramírez — Amlodipina 10mg + Enalapril 10mg — Vigente — 03/06/2026
2. Juan Ramírez — Metformina 850mg — Vigente — 03/06/2026 *(crónica)*
3. Pedro Rodríguez — Losartán 50mg + AAS 100mg — Vigente — 28/05/2026 *(crónica)*
4. Laura Fernández — Levotiroxina 75mcg — Vigente — 15/05/2026 *(crónica)*
5. Valeria Castro — Topiramato 25mg — Vigente — 01/06/2026
6. Carlos Torres — Atorvastatina 40mg + Aspirina 100mg — Vencida — 10/04/2026

---

## Comportamiento

- Navegación SPA sin recarga entre módulos
- Formularios actualizan el estado React y se reflejan en listas
- Toggle dark/light persiste en localStorage y se aplica instantáneamente a toda la app
- Buscador de pacientes filtra en tiempo real mientras se tipea
- Marcar cobro como cobrado actualiza el badge y los totales en el header del módulo
- Modales: cerrar con ESC, click fuera o botón X
- Toasts: aparecen bottom-right, duran 3 segundos, tienen ícono según tipo (check verde, x naranja)
- En mobile (< 768px): sidebar se convierte en bottom navigation con 5 íconos principales
- Drawer lateral (detalle de turno/paciente): aparece desde la derecha, 380px ancho, overlay en el resto

---

## TypeScript — interfaces mínimas

```typescript
interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento: string;
  obraSocial: string;
  nroAfiliado?: string;
  telefono: string;
  email?: string;
  antecedentes: string[];
  alergias: string[];
  medicacionCronica: string[];
}

interface Turno {
  id: string;
  pacienteId: string;
  fecha: string;
  hora: string;
  duracion: 15 | 30 | 45 | 60;
  motivo: string;
  estado: 'confirmado' | 'pendiente' | 'en-consultorio' | 'cancelado' | 'atendido';
  obraSocial: string;
}

interface Consulta {
  id: string;
  pacienteId: string;
  fecha: string;
  motivo: string;
  anamnesis?: string;
  examenFisico?: { ta?: string; fc?: number; temp?: number; peso?: number; talla?: number };
  diagnostico: string;
  cie10?: string;
  indicaciones: string;
  proximoControl?: string;
}

interface Receta {
  id: string;
  pacienteId: string;
  fecha: string;
  medicamentos: { nombre: string; principioActivo: string; dosis: string; posologia: string; duracion: string }[];
  indicaciones?: string;
  estado: 'vigente' | 'vencida';
  esCronica: boolean;
}

interface Cobro {
  id: string;
  pacienteId: string;
  turnoId: string;
  fecha: string;
  monto: number;
  obraSocial: string;
  estado: 'cobrado' | 'pendiente' | 'a-facturar';
}
```

---

## Resultado esperado

Una app que un médico abra en una demo y diga "esto es lo que necesito". Que se vea **terminada**, no como prototipo. Todos los módulos navegables, datos reales en todos lados, cero pantallas vacías, dark mode por defecto con toggle funcional a light, diseño consistente con el sistema Ramp adaptado al contexto médico.
