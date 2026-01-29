"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { formatCompactCurrency } from "@/lib/utils";
import { useInvestments } from "@/hooks";
import { AddInvestmentModal } from "@/components/dashboard/AddInvestmentModal";

export function InvestmentCard() {
    const { investments, totalMarketValue, loading, add, remove } = useInvestments();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"portfolio" | "transactions">("portfolio");
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleAdd = async (data: any) => {
        await add(data);
    };

    const handleDelete = async (id: string | null) => {
        if (id) {
            await remove(id);
            setDeleteId(null);
        }
    };

    return (
        <div className="bg-background-card rounded-2xl p-5 card-hover border border-border-subtle h-full min-h-[350px] flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-text-primary">Inversiones</h3>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="p-1.5 rounded-lg hover:bg-background-elevated transition-colors"
                >
                    <Plus className="w-4 h-4 text-text-secondary" />
                </button>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-6 mb-4">
                <div>
                    <p className="text-lg font-bold text-text-primary flex items-center gap-1">
                        <span className="text-text-muted text-sm">$</span>
                        {totalMarketValue.toLocaleString()}
                    </p>
                    <p className="text-xs text-text-muted">Valor de Mercado</p>
                </div>
                {/* 
                <div>
                    <p className="text-lg font-bold text-text-primary flex items-center gap-1">
                         <span className="text-text-muted text-sm">$</span>
                         {cashBalance.toLocaleString()}
                     </p>
                     <p className="text-xs text-text-muted">Cash Balance</p> 
                </div> 
                */}
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-t border-border pt-3 mb-3">
                <button
                    onClick={() => setActiveTab("portfolio")}
                    className={`text-sm font-medium pt-3 -mt-3 border-t-2 transition-colors ${activeTab === "portfolio"
                        ? "text-primary border-primary"
                        : "text-text-muted border-transparent hover:text-text-secondary"
                        }`}
                >
                    Portafolio
                </button>
                {/* Future: Transactions Tab */}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                {loading ? (
                    <div className="text-center py-4 text-xs text-text-muted">Cargando...</div>
                ) : investments.length === 0 ? (
                    <div className="text-center py-4 text-xs text-text-muted">No hay inversiones aún</div>
                ) : (
                    investments.map((inv) => (
                        <div key={inv.id} className="flex items-center justify-between group p-2 hover:bg-background-elevated rounded-lg transition-colors">
                            <div>
                                <p className="text-sm font-medium text-text-primary">{inv.name}</p>
                                <p className="text-xs text-text-muted capitalize">{inv.type}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-primary">
                                    ${inv.amount.toLocaleString()}
                                </span>
                                <button
                                    onClick={() => setDeleteId(inv.id)}
                                    className="p-1.5 text-text-muted hover:text-accent-red hover:bg-accent-red/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <AddInvestmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAdd}
            />

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-background-card p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4 border border-border">
                        <h3 className="text-lg font-bold text-text-primary mb-2">¿Eliminar inversión?</h3>
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
                                onClick={() => handleDelete(deleteId)}
                                className="px-4 py-2 bg-accent-red text-white rounded-xl hover:bg-accent-red/90 transition-colors"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
