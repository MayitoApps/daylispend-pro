"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { useTransactions, useCategories } from "@/hooks";
import { formatCurrency } from "@/lib/utils";
import { Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { AddTransactionModal } from "@/components/dashboard";

export default function BudgetPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { transactions, totals, balance, add, remove, loading } = useTransactions();
    const { categories } = useCategories();

    // Group transactions by category
    const categoryTotals = transactions.reduce((acc, t) => {
        if (t.type === "expense") {
            const cat = categories.find((c) => c.id === t.category_id);
            const name = cat?.name || "Otro";
            const icon = cat?.icon || "💰";
            const color = cat?.color || "#71717a";

            if (!acc[name]) {
                acc[name] = { amount: 0, icon, color, count: 0 };
            }
            acc[name].amount += t.amount;
            acc[name].count += 1;
        }
        return acc;
    }, {} as Record<string, { amount: number; icon: string; color: string; count: number }>);

    const sortedCategories = Object.entries(categoryTotals)
        .sort((a, b) => b[1].amount - a[1].amount);

    const totalExpenses = totals.expense || 1; // Avoid division by zero

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Header title="Presupuesto" onAddClick={() => setIsModalOpen(true)} />

            <div className="px-8 pb-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    <div className="bg-background-card rounded-2xl p-6 border border-border">
                        <p className="text-text-secondary text-sm mb-2">Balance Total</p>
                        <p className={`text-3xl font-bold ${balance >= 0 ? "text-primary" : "text-accent-red"}`}>
                            {formatCurrency(balance)}
                        </p>
                    </div>
                    <div className="bg-background-card rounded-2xl p-6 border border-border">
                        <p className="text-text-secondary text-sm mb-2">Ingresos</p>
                        <p className="text-3xl font-bold text-primary">{formatCurrency(totals.income)}</p>
                    </div>
                    <div className="bg-background-card rounded-2xl p-6 border border-border">
                        <p className="text-text-secondary text-sm mb-2">Gastos</p>
                        <p className="text-3xl font-bold text-accent-red">{formatCurrency(totals.expense)}</p>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="bg-background-card rounded-2xl p-6 border border-border mb-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-6">Gastos por Categoría</h3>

                    {sortedCategories.length > 0 ? (
                        <div className="space-y-4">
                            {sortedCategories.map(([name, data]) => {
                                const percentage = (data.amount / totalExpenses) * 100;
                                return (
                                    <div key={name}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{data.icon}</span>
                                                <span className="text-text-primary font-medium">{name}</span>
                                                <span className="text-text-muted text-sm">({data.count} transacciones)</span>
                                            </div>
                                            <span className="text-text-primary font-semibold">
                                                {formatCurrency(data.amount)}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-background-elevated rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${percentage}%`,
                                                    backgroundColor: data.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-center text-text-muted py-8">
                            No hay gastos registrados. ¡Agrega tu primera transacción!
                        </p>
                    )}
                </div>

                {/* Recent Transactions */}
                <div className="bg-background-card rounded-2xl p-6 border border-border">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-text-primary">Transacciones Recientes</h3>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-primary hover:bg-primary-hover rounded-lg text-white text-sm font-medium transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Agregar
                        </button>
                    </div>

                    {transactions.length > 0 ? (
                        <div className="space-y-3">
                            {transactions.slice(0, 10).map((t) => {
                                const cat = categories.find((c) => c.id === t.category_id);
                                return (
                                    <div
                                        key={t.id}
                                        className="flex items-center justify-between p-4 bg-background-elevated rounded-xl group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                                                style={{ backgroundColor: `${cat?.color || "#71717a"}20` }}
                                            >
                                                {cat?.icon || "💰"}
                                            </div>
                                            <div>
                                                <p className="font-medium text-text-primary">
                                                    {t.description || cat?.name || "Transacción"}
                                                </p>
                                                <p className="text-sm text-text-muted">
                                                    {new Date(t.date).toLocaleDateString("es-MX", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`text-lg font-bold ${t.type === "income" ? "text-primary" : "text-accent-red"
                                                    }`}
                                            >
                                                {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                                            </span>
                                            <button
                                                onClick={() => {
                                                    if (confirm("¿Eliminar esta transacción?")) {
                                                        remove(t.id);
                                                    }
                                                }}
                                                className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-accent-red/20 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4 text-accent-red" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-center text-text-muted py-8">
                            No hay transacciones. ¡Comienza a registrar tus gastos!
                        </p>
                    )}
                </div>
            </div>

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={add}
                categories={categories}
            />
        </div>
    );
}
