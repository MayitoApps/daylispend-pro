"use client";

import { useMemo } from "react";
import { formatCurrency } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, Trash2, Calendar, Search } from "lucide-react";
import type { Transaction, Category } from "@/types/database";
import { cn } from "@/lib/utils";

interface TransactionsListProps {
    transactions: Transaction[];
    categories: Category[];
    onDelete: (id: string) => void;
    title?: string;
}

export function TransactionsList({
    transactions,
    categories,
    onDelete,
    title = "Historial de Transacciones"
}: TransactionsListProps) {

    // Group transactions by Date
    const groupedTransactions = useMemo(() => {
        const groups: Record<string, Transaction[]> = {};

        transactions.forEach(tx => {
            const date = tx.date;
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(tx);
        });

        // Sort dates desc
        return Object.keys(groups).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).map(date => ({
            date,
            items: groups[date]
        }));
    }, [transactions]);

    const getCategory = (categoryId: string | null) => {
        return categories.find(c => c.id === categoryId) || {
            name: "Otros",
            icon: "🔹",
            color: "#94a3b8"
        };
    };

    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-background-card rounded-2xl border border-border">
                <div className="w-16 h-16 rounded-full bg-background-elevated flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-text-muted" />
                </div>
                <h3 className="text-lg font-medium text-text-primary mb-1">No hay transacciones</h3>
                <p className="text-text-muted">No se encontraron movimientos en esta sección.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-text-primary">{title}</h2>

            <div className="space-y-8">
                {groupedTransactions.map((group) => (
                    <div key={group.date}>
                        <h3 className="text-sm font-medium text-text-muted mb-3 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(group.date).toLocaleDateString("es-MX", {
                                weekday: "long",
                                day: "numeric",
                                month: "long"
                            })}
                        </h3>

                        <div className="bg-background-card rounded-2xl border border-border overflow-hidden">
                            {group.items.map((tx, index) => {
                                const category = getCategory(tx.category_id);
                                return (
                                    <div
                                        key={tx.id}
                                        className={cn(
                                            "flex items-center justify-between p-4 hover:bg-background-elevated/50 transition-colors group",
                                            index !== group.items.length - 1 && "border-b border-border"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Icon */}
                                            <div
                                                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                                                style={{ backgroundColor: `${category.color}20` }}
                                            >
                                                {category.icon}
                                            </div>

                                            {/* Details */}
                                            <div>
                                                <p className="font-medium text-text-primary">
                                                    {tx.description || category.name}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-text-muted">
                                                    <span>{category.name}</span>
                                                    <span>•</span>
                                                    <span className="capitalize">
                                                        {tx.payment_method === 'credit' ? 'Tarjeta Crédito' :
                                                            tx.payment_method === 'debit' ? 'Tarjeta Débito' :
                                                                tx.payment_method === 'transfer' ? 'Transferencia' :
                                                                    'Efectivo'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Original Amount & Actions */}
                                        <div className="flex items-center gap-4">
                                            <span className={cn(
                                                "font-semibold flex items-center gap-1",
                                                tx.type === "expense" ? "text-text-primary" : "text-primary"
                                            )}>
                                                {tx.type === "expense" ? "-" : "+"}
                                                {formatCurrency(tx.amount)}
                                            </span>

                                            <button
                                                onClick={() => onDelete(tx.id)}
                                                className="p-2 text-text-muted hover:text-accent-red hover:bg-accent-red/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
