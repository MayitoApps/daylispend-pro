// Category icons and colors
export const CATEGORY_ICONS: Record<string, string> = {
    comida: "🍔",
    ocio: "🎮",
    servicios: "💡",
    suscripciones: "📺",
    transporte: "🚗",
    vivienda: "🏠",
    salud: "💊",
    groceries: "🛒",
    internet: "🌐",
    investment: "📈",
};

export const CATEGORY_COLORS: Record<string, string> = {
    comida: "#f97316",
    ocio: "#a855f7",
    servicios: "#3b82f6",
    suscripciones: "#ec4899",
    transporte: "#eab308",
    vivienda: "#22c55e",
    salud: "#ef4444",
    groceries: "#22c55e",
    internet: "#ef4444",
    investment: "#3b82f6",
};

// Default categories
export const DEFAULT_CATEGORIES = [
    { name: "Comida", icon: "🍔", color: "#f97316", is_default: true },
    { name: "Ocio", icon: "🎮", color: "#a855f7", is_default: true },
    { name: "Servicios", icon: "💡", color: "#3b82f6", is_default: true },
    { name: "Suscripciones", icon: "📺", color: "#ec4899", is_default: true },
    { name: "Transporte", icon: "🚗", color: "#eab308", is_default: true },
    { name: "Vivienda", icon: "🏠", color: "#22c55e", is_default: true },
];

// Supported currencies
export const CURRENCIES = ["USD", "MXN", "EUR"] as const;
export type Currency = (typeof CURRENCIES)[number];

// Chart colors palette
export const CHART_COLORS = [
    "#22c55e",
    "#3b82f6",
    "#f97316",
    "#a855f7",
    "#ec4899",
    "#eab308",
    "#ef4444",
    "#06b6d4",
];

// Navigation items
export const NAV_ITEMS = [
    { name: "Resumen", href: "/", icon: "LayoutDashboard" },
    { name: "Presupuesto", href: "/budget", icon: "PiggyBank" },
    { name: "Calendario", href: "/scheduler", icon: "Calendar" },
    { name: "Reportes", href: "/reports", icon: "BarChart3" },
    { name: "Categorías", href: "/categories", icon: "List" },
];

// Account types
export const ACCOUNT_ITEMS = [
    { name: "Todas las Transacciones", href: "/transactions", icon: "List", balance: null },
    { name: "Efectivo", href: "/accounts/cash", icon: "Wallet", balance: 0 },
    { name: "Tarjeta de Crédito", href: "/accounts/credit", icon: "CreditCard", balance: 0 },
    { name: "Negocio", href: "/accounts/business", icon: "Briefcase", balance: 0 },
    { name: "Préstamos", href: "/accounts/loan", icon: "HandCoins", balance: 0 },
    { name: "Activos", href: "/accounts/asset", icon: "Building", balance: 0 },
    { name: "Inversiones", href: "/accounts/investment", icon: "TrendingUp", balance: 0 },
];
