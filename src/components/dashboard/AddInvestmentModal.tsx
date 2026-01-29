import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { type Investment } from "@/types/database";

interface AddInvestmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
}

export function AddInvestmentModal({
    isOpen,
    onClose,
    onSubmit,
}: AddInvestmentModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        amount: "",
        type: "stock",
        date: new Date().toISOString().split("T")[0],
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await onSubmit({
                ...formData,
                amount: parseFloat(formData.amount),
            });
            onClose();
            setFormData({
                name: "",
                amount: "",
                type: "stock",
                date: new Date().toISOString().split("T")[0],
            });
        } catch (error: any) {
            console.error("Error adding investment:", error);
            if (error.code === 'permission-denied') {
                setError("Sin permisos. Habilita la colección 'investments' en Firebase.");
            } else {
                setError("Error al guardar. Intenta de nuevo.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-background-card p-6 rounded-2xl shadow-xl max-w-md w-full mx-4 border border-border">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-text-primary">Nueva Inversión</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-text-muted hover:bg-background-elevated rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">
                            Nombre
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-background-elevated border-none rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-primary"
                            placeholder="Ej. Apple Stock"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">
                            Monto Invertido ($)
                        </label>
                        <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className="w-full bg-background-elevated border-none rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-primary"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">
                                Tipo
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full bg-background-elevated border-none rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-primary"
                            >
                                <option value="stock">Acciones</option>
                                <option value="crypto">Cripto</option>
                                <option value="real_estate">Bienes Raíces</option>
                                <option value="other">Otro</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">
                                Fecha
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-background-elevated border-none rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl text-text-secondary hover:bg-background-elevated transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium transition-colors flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                "Guardar"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
