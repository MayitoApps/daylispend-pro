// Database types matching Supabase schema

export interface Profile {
    id: string;
    full_name: string | null;
    currency: "USD" | "MXN" | "EUR";
    updated_at: string | null;
}

export interface Category {
    id: string;
    user_id: string | null;
    name: string;
    icon: string | null;
    color: string | null;
    is_default: boolean;
}

export interface Transaction {
    id: string;
    user_id: string;
    category_id: string | null;
    amount: number;
    type: "income" | "expense";
    description: string | null;
    date: string;
    payment_method: string; // "cash", "credit", "debit", "transfer", etc.
    created_at: string;
}

export interface RecurringService {
    id: string;
    user_id: string;
    name: string;
    amount: number;
    day_of_month: number; // 1-31
    created_at: string; /* timestamp */
}

export interface Investment {
    id: string;
    user_id: string;
    name: string;
    amount: number;
    type: "stock" | "crypto" | "real_estate" | "other";
    date: string;
    created_at: string;
}

export interface CalendarEvent {
    id: string;
    user_id: string;
    date: string; // YYYY-MM-DD
    title: string;
    type: "payment" | "note";
    amount?: number;
    created_at: string;
}

// Extended types with relations
export interface TransactionWithCategory extends Transaction {
    category: Category | null;
}

// Form types
export interface TransactionFormData {
    amount: number;
    type: "income" | "expense";
    category_id: string;
    description: string;
    date: string;
    payment_method: string;
}

export interface CategoryFormData {
    name: string;
    icon: string;
    color: string;
}

// Dashboard data types
export interface DashboardSummary {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    recentTransactions: TransactionWithCategory[];
    categoryBreakdown: CategoryBreakdown[];
}

export interface CategoryBreakdown {
    category: string;
    amount: number;
    percentage: number;
    color: string;
    icon: string;
}

// Chart data types
export interface ChartDataPoint {
    name: string;
    value: number;
    color?: string;
}

export interface TimeSeriesDataPoint {
    date: string;
    income: number;
    expense: number;
}
