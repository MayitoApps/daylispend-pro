"use client";

import { Header } from "@/components/layout/Header";
import { CategoryManager } from "@/components/dashboard/CategoryManager";

export default function CategoriesPage() {
    return (
        <div className="min-h-screen">
            <Header title="Gestión de Categorías" />

            <main className="px-8 pb-8 max-w-7xl mx-auto">
                <div className="mb-6">
                    <p className="text-text-secondary">
                        Administra tus categorías de gastos e ingresos. Puedes crear nuevas categorías personalizadas para organizar mejor tus finanzas.
                    </p>
                </div>

                <CategoryManager />
            </main>
        </div>
    );
}
