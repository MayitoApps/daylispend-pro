"use client";

import { Header } from "@/components/layout/Header";
import { TransactionsList } from "@/components/dashboard/TransactionsList";
import { useTransactions, useCategories } from "@/hooks";
import { useState } from "react";

export default function TransactionsPage() {
    const { transactions, remove, loading } = useTransactions();
    const { categories } = useCategories();

    // Deletion Logic
    const handleDelete = async (id: string) => {
        if (window.confirm("¿Seguro que quieres eliminar esta transacción?")) {
            await remove(id);
        }
    };

    return (
        <div className="min-h-screen pb-10">
            <Header title="Historial Transaccional" />

            <main className="px-8 max-w-5xl mx-auto mt-6">
                {loading ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="h-8 w-48 bg-background-elevated rounded-lg" />
                        <div className="h-64 bg-background-card rounded-2xl" />
                    </div>
                ) : (
                    <TransactionsList
                        transactions={transactions}
                        categories={categories}
                        onDelete={handleDelete}
                        title="Todas las Transacciones"
                    />
                )}
            </main>
        </div>
    );
}
