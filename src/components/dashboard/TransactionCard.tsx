"use client";

import { cn, formatCurrency } from "@/lib/utils";
import { Plus, ArrowDownRight, ArrowUpRight, Trash2 } from "lucide-react";
import type { Transaction, Category } from "@/types/database";

interface TransactionCardProps {
    transactions: Transaction[];
    categories: Category[];
    onAddClick: () => void;
    onDelete?: (id: string) => void;
    loading?: boolean;
}

// Default category for unknown IDs
const unknownCategory = { icon: "💰", name: "Otro", color: "#71717a" };

export function TransactionCard({
    transactions,
    categories,
    onAddClick,
    onDelete,
    loading,
}: TransactionCardProps) {
    // Get category by ID
    const getCategory = (categoryId: string | null) => {
        if (!categoryId) return unknownCategory;
        const cat = categories.find((c) => c.id === categoryId);
        return cat || unknownCategory;
    };

    // Show only last 5 transactions
    const recentTransactions = transactions.slice(0, 5);

    return (
        <div className="bg-background-card rounded-2xl p-5 card-hover border border-border-subtle h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-text-primary">
                    Transacciones
                </h3>
                <button
                    onClick={onAddClick}
                    className="p-1.5 rounded-lg hover:bg-background-elevated transition-colors"
                >
                    <Plus className="w-4 h-4 text-text-secondary" />
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 animate-pulse">
                            <div className="w-10 h-10 rounded-xl bg-background-elevated" />
                            <div className="flex-1">
                                <div className="h-4 w-24 bg-background-elevated rounded mb-1" />
                                <div className="h-3 w-16 bg-background-elevated rounded" />
                            </div>
                            <div className="h-4 w-16 bg-background-elevated rounded" />
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && transactions.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-text-muted text-sm mb-3">No hay transacciones</p>
                    <button
                        onClick={onAddClick}
                        className="text-primary text-sm font-medium hover:underline"
                    >
                        Agregar primera transacción
                    </button>
                </div>
            )}

            {/* Transaction List */}
            {!loading && recentTransactions.length > 0 && (
                <div className="space-y-3">
                    {recentTransactions.map((tx) => {
                        const category = getCategory(tx.category_id);

                        return (
                            <div
                                key={tx.id}
                                className="flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-3">
                                    {/* Icon */}
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                                        style={{ backgroundColor: `${category.color}20` }}
                                    >
                                        {category.icon}
                                    </div>
                                    {/* Info */}
                                    <div>
                                        <p className="text-sm font-medium text-text-primary">
                                            {tx.description || category.name}
                                        </p>
                                        <p className="text-xs text-text-muted">
                                            {new Date(tx.date).toLocaleDateString("es-MX", {
                                                day: "2-digit",
                                                month: "short",
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Amount & Delete */}
                                <div className="flex items-center gap-2">
                                    <span
                                        className={cn(
                                            "text-sm font-semibold flex items-center gap-1",
                                            tx.type === "expense" ? "text-text-primary" : "text-primary"
                                        )}
                                    >
                                        {tx.type === "expense" ? (
                                            <ArrowDownRight className="w-3 h-3 text-accent-red" />
                                        ) : (
                                            <ArrowUpRight className="w-3 h-3 text-primary" />
                                        )}
                                        {formatCurrency(tx.amount)}
                                    </span>

                                    {onDelete && (
                                        <button
                                            onClick={() => onDelete(tx.id)}
                                            className="p-1.5 rounded-lg hover:bg-accent-red/20 transition-all text-text-muted hover:text-accent-red"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* View All Link */}
            {transactions.length > 5 && (
                <button className="w-full mt-4 py-2 text-sm text-primary hover:underline">
                    Ver todas ({transactions.length})
                </button>
            )}
        </div>
    );
}
