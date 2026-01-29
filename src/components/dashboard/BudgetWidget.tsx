"use client";

import { Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface BudgetWidgetProps {
    totalIncome: number;
    totalExpense: number;
    loading?: boolean;
}

export function BudgetWidget({ totalIncome, totalExpense, loading }: BudgetWidgetProps) {
    const balance = totalIncome - totalExpense;

    if (loading) {
        return (
            <div className="bg-background-card rounded-2xl p-5 card-hover border border-border-subtle animate-pulse">
                <div className="h-5 w-20 bg-background-elevated rounded mb-5" />
                <div className="space-y-4">
                    <div className="h-12 bg-background-elevated rounded" />
                    <div className="h-12 bg-background-elevated rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-card rounded-2xl p-5 card-hover border border-border-subtle h-full flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-text-primary">Resumen</h3>
                <button className="p-1.5 rounded-lg hover:bg-background-elevated transition-colors">
                    <Plus className="w-4 h-4 text-text-secondary" />
                </button>
            </div>

            {/* Balance */}
            <div className="bg-primary/10 rounded-xl p-4 mb-4">
                <p className="text-xs text-text-muted mb-1">Balance Actual</p>
                <p className={`text-2xl font-bold ${balance >= 0 ? "text-primary" : "text-accent-red"}`}>
                    {formatCurrency(balance)}
                </p>
            </div>

            {/* Income & Expense Summary */}
            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-background-elevated rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                            <span className="text-primary text-sm">↑</span>
                        </div>
                        <span className="text-sm text-text-secondary">Ingresos</span>
                    </div>
                    <span className="text-sm font-bold text-primary">
                        {formatCurrency(totalIncome)}
                    </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-background-elevated rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent-red/20 flex items-center justify-center">
                            <span className="text-accent-red text-sm">↓</span>
                        </div>
                        <span className="text-sm text-text-secondary">Gastos</span>
                    </div>
                    <span className="text-sm font-bold text-accent-red">
                        {formatCurrency(totalExpense)}
                    </span>
                </div>
            </div>
        </div>
    );
}
