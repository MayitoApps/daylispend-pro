# Especificación de Requerimientos de Software (SRS)
## Proyecto: DailySpend Pro - Sistema de Gestión Financiera

---

## 1. Introducción
**DailySpend Pro** es una plataforma web de última generación diseñada para centralizar la gestión de finanzas personales. El sistema permite a los usuarios registrar flujos de efectivo, categorizar gastos de forma inteligente y obtener perspectivas analíticas mediante visualizaciones interactivas y reportes exportables.

### 1.1 Objetivos del Sistema
* Reducir la fricción en el registro de gastos diarios.
* Proporcionar visibilidad clara sobre los hábitos de consumo por categorías.
* Garantizar la integridad y seguridad de los datos financieros mediante arquitectura Cloud.

---

## 2. Alcance y Usuarios

### 2.1 Roles de Usuario
* **Usuario Final:** Propietario de la cuenta que gestiona sus propios datos.
* **Sistema (Supabase):** Motor de base de datos, autenticación y políticas de seguridad (RLS).

### 2.2 Casos de Uso Principales
1.  **Registro de Transacción:** El usuario ingresa un gasto o ingreso.
2.  **Consulta de Dashboard:** El usuario visualiza gráficas de sus gastos del mes.
3.  **Gestión de Categorías:** El usuario personaliza sus etiquetas de gasto.
4.  **Exportación de Datos:** El usuario genera un reporte Excel para contabilidad externa.

---

## 3. Requerimientos Funcionales (RF)

### 3.1 Módulo de Autenticación y Perfil
* **RF-01:** Registro e inicio de sesión seguro mediante correo electrónico y contraseña (Supabase Auth).
* **RF-02:** Soporte para inicio de sesión único (Google OAuth).
* **RF-03:** Configuración de perfil: Selección de moneda base (MXN, USD, EUR) y nombre del usuario.

### 3.2 Gestión Financiera (Core)
* **RF-04:** Registro de movimientos con los siguientes campos obligatorios:
    * Monto (Soporte para precisión decimal).
    * Tipo (Ingreso o Egreso).
    * Categoría (Relación con tabla de categorías).
    * Fecha de la transacción (Selector de fecha).
* **RF-05:** Gestión de Categorías:
    * El sistema proveerá categorías por defecto: *Comida, Ocio, Servicios, Suscripciones, Transporte, Vivienda*.
    * El usuario podrá crear, editar o eliminar categorías personalizadas (nombre, color e icono).
* **RF-06:** Cálculo de Balance: El sistema debe calcular el saldo actual automáticamente:
    $$Balance = \sum(Ingresos) - \sum(Gastos)$$

### 3.3 Visualización y Analytics
* **RF-07:** Dashboard con gráficas interactivas:
    * Gráfica de Dona: Distribución porcentual de gastos por categoría.
    * Gráfica de Barras/Líneas: Comparativa de ingresos vs gastos en los últimos 6 meses.
* **RF-08:** Filtros de tiempo: El sistema permitirá segmentar la información por rangos: Diario, Semanal, Mensual, Anual y Personalizado.

### 3.4 Reportes y Exportación
* **RF-09:** Exportación a Excel: Generación de un archivo `.xlsx` que incluya:
    * ID de transacción, Fecha, Categoría, Descripción, Monto y Tipo.
* **RF-10:** Buscador de transacciones: Filtro por texto en el campo de descripción.

---

## 4. Requerimientos No Funcionales (RNF)

| Categoría | Requerimiento | Descripción |
| :--- | :--- | :--- |
| **Seguridad** | Row Level Security (RLS) | Los datos están aislados a nivel de base de datos; un usuario nunca podrá ver transacciones ajenas. |
| **Rendimiento** | Tiempo de Respuesta | Las consultas deben resolverse en menos de 300ms en condiciones normales de red. |
| **Diseño** | Interfaz Responsiva | La UI debe adaptarse automáticamente a dispositivos móviles, tablets y escritorio (PWA Ready). |
| **Disponibilidad** | Persistencia Cloud | Los datos deben estar disponibles 24/7 mediante la infraestructura de Supabase. |

---

## 5. Arquitectura Técnica y Datos

### 5.1 Stack Tecnológico
* **Frontend:** Next.js 14+ (App Router) o React con Vite.
* **Estilos:** Tailwind CSS con componentes Radix UI o Shadcn/ui.
* **Backend/DB:** Supabase (PostgreSQL).
* **Gráficas:** Recharts o Lucide-react para iconos.
* **Lógica de Reportes:** ExcelJS.

### 5.2 Estructura de Base de Datos (ERD)



```sql
-- Tabla de Perfiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  currency TEXT DEFAULT 'USD',
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Tabla de Categorías
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users, -- NULL para categorías globales
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  is_default BOOLEAN DEFAULT false
);

-- Tabla de Transacciones
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  category_id UUID REFERENCES categories,
  amount NUMERIC(15, 2) NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')),
  description TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);