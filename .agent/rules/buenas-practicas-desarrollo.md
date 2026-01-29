---
trigger: always_on
---

Directrices de Desarrollo y Buenas Prácticas: Proyecto DailySpend
1. Arquitectura y Código Limpio
Componentización Atómica: Dividir la interfaz en componentes pequeños y reutilizables (Atoms, Molecules, Organisms). Ningún archivo de componente debe exceder las 200 líneas.

Principio de Responsabilidad Única (SRP): Cada componente o función debe hacer solo una cosa. La lógica de negocio (cálculos financieros) debe estar separada de la lógica de la interfaz (UI).

Tipado Estricto: Si se usa TypeScript, no se permite el uso de any. Todas las interfaces de la base de datos deben estar tipadas según el esquema de Supabase.

DRY (Don't Repeat Yourself): Centralizar funciones comunes (formateo de moneda, manejo de fechas con date-fns o dayjs) en una carpeta de utils/.

2. Estándares de Seguridad (Supabase First)
RLS (Row Level Security) Obligatorio: Ninguna tabla debe ser accesible públicamente. Todas las políticas deben validar que auth.uid() = user_id.

Validación en el Cliente y Servidor: No confiar únicamente en la validación del frontend. Usar Check Constraints en PostgreSQL para asegurar que los montos nunca sean negativos si no se desea.

Manejo de Variables de Entorno: Nunca hardcodear las claves de Supabase. Usar archivos .env y asegurar que la SERVICE_ROLE_KEY nunca se exponga en el cliente.

3. Rendimiento y Experiencia de Usuario (UX)
Optimistic Updates: Al registrar un gasto, la interfaz debe actualizarse inmediatamente antes de que la base de datos confirme la operación, mejorando la percepción de velocidad.

Estados de Carga (Skeletons): Prohibido usar "Spinners" genéricos en toda la pantalla. Usar Skeleton Screens que imiten la estructura del contenido que se está cargando.

Mobile-First: El diseño debe ser funcional en una pantalla de 360px de ancho antes de optimizarse para escritorio.

Accesibilidad (A11y): Uso correcto de etiquetas semánticas (<main>, <section>, <nav>) y contraste de colores (mínimo ratio 4.5:1 para texto).

4. Gestión de Estado y Datos
Estrategia de Fetching: Utilizar herramientas como React Query o SWR para el manejo de caché y revalidación de datos financieros.

Normalización de Moneda: Almacenar siempre los valores monetarios en numeric o integer (centavos) para evitar errores de redondeo de punto flotante en JavaScript.

Paginación y Virtualización: Si el historial de transacciones supera los 50 registros, implementar Infinite Scroll o paginación para no saturar el DOM.

5. Estándares de Estilo (Tailwind CSS)
Utility-First: No crear clases CSS personalizadas a menos que sea estrictamente necesario. Usar la configuración de tailwind.config.js para definir la paleta de colores de la marca.

Consistencia de Espaciado: Usar múltiplos de 4 (p-4, m-8, gap-2) para mantener una rejilla visual armónica.

Modo Oscuro: Implementar soporte nativo para dark mode utilizando la clase dark: de Tailwind.

6. Flujo de Trabajo y Git
Commits Semánticos: Seguir la convención de Conventional Commits:

feat: para nuevas funcionalidades.

fix: para corrección de errores.

refactor: para mejoras de código que no cambian la lógica.

Documentación de Código: Comentar el "por qué" de una lógica compleja, no el "qué" (el código debe ser legible por sí mismo).