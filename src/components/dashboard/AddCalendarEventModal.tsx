import { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon, DollarSign, Type } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface AddCalendarEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { date: string; title: string; amount?: number }) => Promise<void>;
    selectedDate: Date;
}

export function AddCalendarEventModal({ isOpen, onClose, onSubmit, selectedDate }: AddCalendarEventModalProps) {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTitle("");
            setAmount("");
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({
                date: format(selectedDate, "yyyy-MM-dd"), // Store locally as string
                title,
                amount: amount ? parseFloat(amount) : undefined,
            });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-background-card border border-border-subtle rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border-subtle bg-background-main/50">
                    <h2 className="text-xl font-semibold text-text-primary">Agregar Nota o Pago</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-background-elevated rounded-lg transition-colors text-text-secondary hover:text-text-primary"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* Date Display (Read-only) */}
                    <div className="flex items-center gap-3 p-3 bg-background-main rounded-xl border border-border-subtle">
                        <div className="p-2 bg-accent-primary/10 rounded-lg">
                            <CalendarIcon className="w-5 h-5 text-accent-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-text-muted font-medium">Fecha Seleccionada</p>
                            <p className="text-sm font-semibold text-text-primary capitalize">
                                {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                                <Type className="w-4 h-4" />
                                Título o Nota
                            </label>
                            <input
                                required
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ej. Pagar tarjeta, Cumpleaños..."
                                className="w-full bg-background-main border border-border-subtle rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all placeholder:text-text-muted"
                                style={{ color: '#000000' }} // Force visible text
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                Monto (Opcional)
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-background-main border border-border-subtle rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all placeholder:text-text-muted"
                                style={{ color: '#000000' }} // Force visible text
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 rounded-xl font-medium text-text-secondary hover:bg-background-elevated hover:text-text-primary transition-colors border border-transparent hover:border-border-subtle"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !title.trim()}
                            className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-accent-primary hover:bg-accent-primary/90 transition-all shadow-lg shadow-accent-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Guardando..." : "Guardar Nota"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
