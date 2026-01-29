"use client";

import { useState, useEffect } from "react";
import { X, DollarSign, Calendar, Tag, FileText, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TransactionFormData, Category } from "@/types/database";

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: TransactionFormData) => Promise<void>;
    categories: Category[];
}

// Default categories if none loaded from Firestore
const defaultCategories: Category[] = [
    { id: "1", user_id: null, name: "Comida", icon: "🍔", color: "#f97316", is_default: true },
    { id: "2", user_id: null, name: "Ocio", icon: "🎮", color: "#a855f7", is_default: true },
    { id: "3", user_id: null, name: "Servicios", icon: "💡", color: "#3b82f6", is_default: true },
    { id: "4", user_id: null, name: "Suscripciones", icon: "📺", color: "#ec4899", is_default: true },
    { id: "5", user_id: null, name: "Transporte", icon: "🚗", color: "#eab308", is_default: true },
    { id: "6", user_id: null, name: "Vivienda", icon: "🏠", color: "#22c55e", is_default: true },
];

export function AddTransactionModal({
    isOpen,
    onClose,
    onSubmit,
    categories,
}: AddTransactionModalProps) {
    const [formData, setFormData] = useState<TransactionFormData>({
        amount: 0,
        type: "expense",
        category_id: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        payment_method: "cash",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Use default categories if none provided
    const displayCategories = categories.length > 0 ? categories : defaultCategories;

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({
                amount: 0,
                type: "expense",
                category_id: displayCategories[0]?.id || "",
                description: "",
                date: new Date().toISOString().split("T")[0],
                payment_method: "cash",
            });
            setError("");
        }
    }, [isOpen, displayCategories]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.amount <= 0) {
            setError("El monto debe ser mayor a 0");
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (err) {
            setError("Error al guardar la transacción");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-background-card rounded-2xl border border-border shadow-xl animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-semibold text-text-primary">
                        Nueva Transacción
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-background-elevated transition-colors"
                    >
                        <X className="w-5 h-5 text-text-muted" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Error */}
                    {error && (
                        <div className="p-3 rounded-lg bg-accent-red/10 border border-accent-red/20 text-accent-red text-sm">
                            {error}
                        </div>
                    )}

                    {/* Type Toggle */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: "expense" })}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all",
                                formData.type === "expense"
                                    ? "bg-accent-red text-white"
                                    : "bg-background-elevated text-text-secondary hover:bg-background"
                            )}
                        >
                            <ArrowDownCircle className="w-5 h-5" />
                            Gasto
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: "income" })}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all",
                                formData.type === "income"
                                    ? "bg-primary text-white"
                                    : "bg-background-elevated text-text-secondary hover:bg-background"
                            )}
                        >
                            <ArrowUpCircle className="w-5 h-5" />
                            Ingreso
                        </button>
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Cuenta / Método de Pago
                        </label>
                        <select
                            value={formData.payment_method}
                            onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                            className="w-full px-4 py-3 bg-background-elevated rounded-xl border border-border focus:border-primary focus:outline-none text-text-primary appearance-none cursor-pointer"
                        >
                            <option value="cash">Efectivo 💵</option>
                            <option value="credit">Tarjeta de Crédito 💳</option>
                            <option value="debit">Tarjeta de Débito 💳</option>
                            <option value="business">Negocio 💼</option>
                            <option value="loan">Préstamos 💰</option>
                            <option value="asset">Activos 🏠</option>
                            <option value="transfer">Transferencia 🏦</option>
                        </select>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Monto
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.amount || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
                                }
                                className="w-full pl-10 pr-4 py-3 bg-background-elevated rounded-xl border border-border focus:border-primary focus:outline-none text-text-primary text-lg font-semibold"
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Categoría
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {displayCategories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, category_id: cat.id })}
                                    className={cn(
                                        "flex flex-col items-center gap-1 p-3 rounded-xl transition-all",
                                        formData.category_id === cat.id
                                            ? "bg-primary/20 border-2 border-primary"
                                            : "bg-background-elevated border-2 border-transparent hover:bg-background"
                                    )}
                                >
                                    <span className="text-xl">{cat.icon}</span>
                                    <span className="text-xs text-text-secondary truncate w-full text-center">
                                        {cat.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Descripción
                        </label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
                            <input
                                type="text"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                className="w-full pl-10 pr-4 py-3 bg-background-elevated rounded-xl border border-border focus:border-primary focus:outline-none text-text-primary"
                                placeholder="Descripción opcional"
                            />
                        </div>
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Fecha
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) =>
                                    setFormData({ ...formData, date: e.target.value })
                                }
                                className="w-full pl-10 pr-4 py-3 bg-background-elevated rounded-xl border border-border focus:border-primary focus:outline-none text-text-primary"
                                required
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium text-white transition-colors"
                    >
                        {isSubmitting ? "Guardando..." : "Guardar Transacción"}
                    </button>
                </form>
            </div>
        </div>
    );
}
