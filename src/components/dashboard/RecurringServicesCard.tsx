"use client";

import { useRecurringServices } from "@/hooks";
import { Plus, Trash2, Calendar } from "lucide-react";
import { useState } from "react";
import { AddServiceModal } from "./AddServiceModal";

export function RecurringServicesCard() {
    const { services, add, remove } = useRecurringServices();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="bg-background-card rounded-2xl p-5 card-hover border border-border-subtle h-full min-h-[350px] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-text-primary">Servicios Recurrentes</h3>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="p-1.5 rounded-lg hover:bg-background-elevated transition-colors"
                        title="Agregar Servicio"
                    >
                        <Plus className="w-4 h-4 text-text-secondary" />
                    </button>
                </div>

                {/* List of Services */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                    {services.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-text-muted text-sm pb-4">
                            <Calendar className="w-8 h-8 opacity-20 mb-2" />
                            <p>Sin servicios configurados.</p>
                        </div>
                    ) : (
                        services.map((service) => (
                            <div
                                key={service.id}
                                className="group flex items-center justify-between p-3 rounded-xl bg-background-elevated/50 hover:bg-background-elevated transition-all border border-transparent hover:border-border-subtle"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue font-bold text-xs">
                                        {service.day_of_month}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-text-primary">{service.name}</p>
                                        <p className="text-xs text-text-secondary">
                                            ${service.amount?.toLocaleString() || '0'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => remove(service.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-accent-red/10 hover:text-accent-red rounded-lg transition-all"
                                    title="Eliminar"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <AddServiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={async (data) => {
                    await add(data);
                }}
            />
        </>
    );
}
