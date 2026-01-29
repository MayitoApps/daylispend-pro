"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { useCategories } from "@/hooks";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const EMOJIS = ["🍔", "🎮", "💡", "📺", "🚗", "🏠", "💊", "🛒", "🌐", "📈", "✈️", "👗", "🎁", "📚", "🏋️", "🎵", "🐶", "👶", "🍕", "🍺"];
const COLORS = [
    "#ef4444", "#f97316", "#f59e0b", "#eab308",
    "#84cc16", "#22c55e", "#10b981", "#14b8a6",
    "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1",
    "#8b5cf6", "#a855f7", "#d946ef", "#ec4899",
    "#f43f5e", "#64748b", "#71717a", "#1f2937"
];

export function CategoryManager() {
    const { categories, add, remove, loading } = useCategories();
    const [isAdding, setIsAdding] = useState(false);
    const [newCategory, setNewCategory] = useState({
        name: "",
        icon: "💰",
        color: "#3b82f6"
    });

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.name) return;

        try {
            await add(newCategory);
            setIsAdding(false);
            setNewCategory({ name: "", icon: "💰", color: "#3b82f6" });
        } catch (error) {
            console.error(error);
        }
    };

    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (deleteId) {
            await remove(deleteId);
            setDeleteId(null);
        }
    };

    if (loading) {
        return <div className="animate-pulse h-64 bg-background-card rounded-2xl" />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-text-primary">Mis Categorías</h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors font-medium"
                >
                    {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {isAdding ? "Cancelar" : "Nueva Categoría"}
                </button>
            </div>

            {/* Custom Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-background-card p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4 border border-border">
                        <h3 className="text-lg font-bold text-text-primary mb-2">¿Eliminar categoría?</h3>
                        <p className="text-text-secondary mb-6">
                            Esta acción no se puede deshacer.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="px-4 py-2 rounded-xl text-text-secondary hover:bg-background-elevated transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-accent-red text-white rounded-xl hover:bg-accent-red/90 transition-colors"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isAdding && (
                <form onSubmit={handleAdd} className="bg-background-card border border-border rounded-2xl p-6 animate-in slide-in-from-top-4">
                    <h3 className="text-lg font-medium mb-4 text-text-primary">Crear Categoría</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Nombre</label>
                            <input
                                type="text"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Ej. Gimnasio"
                                className="w-full px-4 py-2 rounded-xl bg-background-elevated border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Icono</label>
                            <div className="flex flex-wrap gap-2">
                                {EMOJIS.slice(0, 10).map(emoji => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => setNewCategory(prev => ({ ...prev, icon: emoji }))}
                                        className={cn(
                                            "w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all",
                                            newCategory.icon === emoji ? "bg-primary text-white scale-110" : "bg-background-elevated hover:bg-border"
                                        )}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="col-span-full space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Color</label>
                            <div className="flex flex-wrap gap-3">
                                {COLORS.map(color => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setNewCategory(prev => ({ ...prev, color: color }))}
                                        className={cn(
                                            "w-8 h-8 rounded-full transition-all",
                                            newCategory.color === color ? "ring-2 ring-offset-2 ring-text-primary scale-110" : "hover:scale-110"
                                        )}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-border">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-hover font-medium"
                        >
                            Guardar Categoría
                        </button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className="p-4 bg-background-card border border-border-subtle rounded-xl flex items-center justify-between group hover:border-primary/50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                style={{ backgroundColor: `${cat.color}20`, color: cat.color }} // tinted bg
                            >
                                {cat.icon}
                            </div>
                            <div>
                                <h4 className="font-medium text-text-primary">{cat.name}</h4>
                                <span className={cn(
                                    "text-xs px-2 py-0.5 rounded-full",
                                    cat.is_default ? "bg-background-elevated text-text-muted" : "bg-primary/10 text-primary"
                                )}>
                                    {cat.is_default ? "Predeterminada" : "Personalizada"}
                                </span>
                            </div>
                        </div>

                        {!cat.is_default && (
                            <button
                                onClick={() => handleDeleteClick(cat.id)}
                                className="p-2 text-text-muted hover:text-accent-red hover:bg-accent-red/10 rounded-lg transition-all"
                                title="Eliminar categoría"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
