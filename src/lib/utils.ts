import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format currency with locale support
 */
export function formatCurrency(
    amount: number,
    currency: "USD" | "MXN" | "EUR" = "USD"
): string {
    const locales: Record<string, string> = {
        USD: "en-US",
        MXN: "es-MX",
        EUR: "de-DE",
    };

    return new Intl.NumberFormat(locales[currency], {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

/**
 * Format compact currency (e.g., $14.5K)
 */
export function formatCompactCurrency(
    amount: number,
    currency: "USD" | "MXN" | "EUR" = "USD"
): string {
    if (Math.abs(amount) >= 1000000) {
        return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (Math.abs(amount) >= 1000) {
        return `$${(amount / 1000).toFixed(1)}K`;
    }
    return formatCurrency(amount, currency);
}

/**
 * Calculate balance from transactions
 */
export function calculateBalance(
    transactions: Array<{ amount: number; type: "income" | "expense" }>
): number {
    return transactions.reduce((balance, tx) => {
        return tx.type === "income" ? balance + tx.amount : balance - tx.amount;
    }, 0);
}

/**
 * Get percentage of total
 */
export function getPercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
}

/**
 * Generate a random ID
 */
export function generateId(): string {
    return crypto.randomUUID();
}
