"use client";

import { Header } from "@/components/layout/Header";
import { TransactionsList } from "@/components/dashboard/TransactionsList";
import { useTransactions, useCategories } from "@/hooks";
import { useParams } from "next/navigation";

const ACCOUNT_TITLES: Record<string, string> = {
    cash: "Efectivo",
    credit: "Tarjeta de Crédito",
    debit: "Tarjeta de Débito",
    business: "Negocio",
    loan: "Préstamos",
    asset: "Activos",
    investment: "Inversiones",
    transfer: "Transferencia",
};

export default function AccountTransactionsPage() {
    const params = useParams();
    const type = params.type as string;

    const { transactions, remove, loading } = useTransactions();
    const { categories } = useCategories();

    // Filter by payment_method (account type)
    const filteredTransactions = transactions.filter(
        (tx) => tx.payment_method === type
    );

    const handleDelete = async (id: string) => {
        if (window.confirm("¿Seguro que quieres eliminar esta transacción?")) {
            await remove(id);
        }
    };

    const title = ACCOUNT_TITLES[type] || "Cuenta";

    return (
        <div className="min-h-screen pb-10">
            <Header title={`Cuenta: ${title}`} />

            <main className="px-8 max-w-5xl mx-auto mt-6">
                {loading ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="h-8 w-48 bg-background-elevated rounded-lg" />
                        <div className="h-64 bg-background-card rounded-2xl" />
                    </div>
                ) : (
                    <TransactionsList
                        transactions={filteredTransactions}
                        categories={categories}
                        onDelete={handleDelete}
                        title={`Transacciones: ${title}`}
                    />
                )}
            </main>
        </div>
    );
}
