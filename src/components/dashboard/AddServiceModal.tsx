"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface AddServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; day_of_month: number; amount: number }) => Promise<void>;
}

export function AddServiceModal({ isOpen, onClose, onSubmit }: AddServiceModalProps) {
    const [name, setName] = useState("");
    const [day, setDay] = useState(1);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({
                name,
                day_of_month: Number(day),
                amount: Number(amount)
            });
            setName("");
            setDay(1);
            setAmount("");
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-background-card w-full max-w-md rounded-2xl border border-border-subtle shadow-xl overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-border-subtle">
                    <h2 className="text-xl font-bold text-text-primary">Nuevo Servicio</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-background-elevated rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-text-secondary" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">Nombre del Servicio</label>
                        <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej. Netflix, Internet..."
                            className="w-full bg-background-main border border-border-subtle rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all"
                            style={{ color: '#000000' }} /* Forced black for visibility */
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Día del Pago (1-31)</label>
                            <input
                                required
                                type="number"
                                min="1"
                                max="31"
                                value={day}
                                onChange={(e) => setDay(Number(e.target.value))}
                                className="w-full bg-background-main border border-border-subtle rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all"
                                style={{ color: '#000000' }}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Monto ($)</label>
                            <input
                                required
                                type="number"
                                min="0"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-background-main border border-border-subtle rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all"
                                style={{ color: '#000000' }}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl text-text-secondary hover:bg-background-elevated transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !name || !amount}
                            className="px-6 py-2.5 bg-accent-primary text-white rounded-xl hover:bg-accent-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Guardando..." : "Guardar Servicio"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
