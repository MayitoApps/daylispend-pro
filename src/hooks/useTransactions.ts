"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/auth-context";
import {
    getTransactions,
    getCategories,
    addTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
} from "@/lib/firebase/firestore";
import type { Transaction, Category, TransactionFormData, CategoryFormData } from "@/types/database";
import { startOfMonth, endOfMonth, isWithinInterval, subDays, startOfDay, endOfDay, parseISO, format } from "date-fns";

export function useTransactions() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch transactions
    const fetchTransactions = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const data = await getTransactions(user.uid);
            setTransactions(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching transactions:", err);
            setError("Error al cargar transacciones");
        } finally {
            setLoading(false);
        }
    };

    // Add transaction
    const add = async (data: TransactionFormData) => {
        if (!user) return;

        try {
            const id = await addTransaction(user.uid, data);

            // Optimistic update
            const newTransaction: Transaction = {
                id,
                user_id: user.uid,
                ...data,
                created_at: new Date().toISOString(),
            };

            setTransactions((prev) => [newTransaction, ...prev]);
            return id;
        } catch (err) {
            console.error("Error adding transaction:", err);
            throw err;
        }
    };

    // Delete transaction
    const remove = async (transactionId: string) => {
        try {
            await deleteTransaction(transactionId);

            // Optimistic update
            setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
        } catch (err) {
            console.error("Error deleting transaction:", err);
            throw err;
        }
    };

    // Calculate totals
    const totals = transactions.reduce(
        (acc, t) => {
            if (t.type === "income") {
                acc.income += t.amount;
            } else {
                acc.expense += t.amount;
            }
            return acc;
        },
        { income: 0, expense: 0 }
    );

    // Calculate monthly totals
    const monthlyTotals = transactions.reduce(
        (acc, t) => {
            const date = parseISO(t.date);
            const now = new Date();

            if (isWithinInterval(date, { start: startOfMonth(now), end: endOfMonth(now) })) {
                if (t.type === "income") {
                    acc.income += t.amount;
                } else {
                    acc.expense += t.amount;
                }
            }
            return acc;
        },
        { income: 0, expense: 0 }
    );

    // Calculate daily stats for the last 7 days (for charts)
    const dailyStats = Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(new Date(), 6 - i); // 6 days ago to today
        const dayStart = startOfDay(date);
        const dayEnd = endOfDay(date);

        const dayTransactions = transactions.filter((t) => {
            const tDate = parseISO(t.date);
            return isWithinInterval(tDate, { start: dayStart, end: dayEnd });
        });

        const income = dayTransactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);

        const expense = dayTransactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            date: format(date, "EEE"), // Mon, Tue, etc.
            fullDate: format(date, "yyyy-MM-dd"),
            income,
            expense,
            // For the chart shown in screenshot, it seems to be total activity or net?
            // "Tall green bars" usually implies income or just activity volume? 
            // The screenshot shows green bars with some variation. 
            // If it's "Reports", it might be Income (green) vs Expense (Red)? 
            // The screenshot only shows Green bars. Let's assume it's Income or Net Positive Balance.
            // Or maybe it's just "Activity". 
            // Given the color is green (#22c55e), let's map it to Income for now, or Net if positive.
            value: income // Using income for the green bars as per common patterns for positive/green indicators.
        };
    });

    const balance = totals.income - totals.expense;

    useEffect(() => {
        fetchTransactions();
    }, [user]);

    return {
        transactions,
        loading,
        error,
        add,
        remove,
        refresh: fetchTransactions,
        totals,
        balance,
        monthlyTotals,
        dailyStats,
    };
}

export function useCategories() {
    const { user } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            if (!user) return;

            try {
                const data = await getCategories(user.uid);
                setCategories(data);
            } catch (err) {
                console.error("Error fetching categories:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [user]);

    const add = async (data: { name: string; icon: string; color: string }) => {
        if (!user) return;
        try {
            const id = await addCategory(user.uid, data);
            const newCategory: Category = {
                id,
                user_id: user.uid,
                is_default: false,
                ...data,
            };
            setCategories((prev) => [...prev, newCategory]);
        } catch (err) {
            console.error("Error adding category:", err);
            throw err;
        }
    };

    const remove = async (id: string) => {
        try {
            await deleteCategory(id);
            setCategories((prev) => prev.filter((c) => c.id !== id));
        } catch (err) {
            console.error("Error deleting category:", err);
            throw err;
        }
    };

    return { categories, loading, add, remove };
}

