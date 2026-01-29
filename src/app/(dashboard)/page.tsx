"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { useTransactions, useCategories } from "@/hooks";
import {
    TransactionCard,
    ReportsCard,
    SchedulerWidget,
    BudgetWidget,
    RecurringServicesCard,
    RetirementCard,
    InvestmentCard,
    BusinessCard,
    AddTransactionModal,
} from "@/components/dashboard";
import type { TransactionFormData } from "@/types/database";

export default function OverviewPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const { transactions, loading, add, remove, totals, monthlyTotals, dailyStats } = useTransactions();
    const { categories } = useCategories();
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("q")?.toLowerCase() || "";

    // Filter transactions based on search query
    const filteredTransactions = useMemo(() => {
        if (!searchQuery) return transactions;
        return transactions.filter((t) =>
            (t.description || "").toLowerCase().includes(searchQuery)
        );
    }, [transactions, searchQuery]);

    const handleAddTransaction = async (data: TransactionFormData) => {
        await add(data);
    };

    const handleDeleteTransaction = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (deleteId) {
            await remove(deleteId);
            setDeleteId(null);
        }
    };

    return (
        <div className="min-h-screen">
            <Header title="Resumen" onAddClick={() => setIsModalOpen(true)} />

            {/* Dashboard Grid */}
            <div className="px-8 pb-8">
                <div className="grid grid-cols-12 gap-5">
                    {/* Row 1 */}
                    {/* Transactions - spans 3 cols */}
                    <div className="col-span-12 lg:col-span-3">
                        <TransactionCard
                            transactions={filteredTransactions}
                            categories={categories}
                            onAddClick={() => setIsModalOpen(true)}
                            onDelete={handleDeleteTransaction}
                            loading={loading}
                        />
                    </div>

                    {/* Reports - spans 3 cols */}
                    <div className="col-span-12 md:col-span-6 lg:col-span-3">
                        <ReportsCard
                            totalIncome={monthlyTotals.income}
                            totalExpense={monthlyTotals.expense}
                            monthlyBalance={monthlyTotals.income - monthlyTotals.expense}
                            chartData={dailyStats.map(d => ({ value: d.value, label: d.date }))}
                        />
                    </div>

                    {/* Scheduler - spans 3 cols */}
                    <div className="col-span-12 md:col-span-6 lg:col-span-3">
                        <SchedulerWidget />
                    </div>

                    {/* Budget Summary - spans 3 cols */}
                    <div className="col-span-12 lg:col-span-3">
                        <BudgetWidget
                            totalIncome={totals.income}
                            totalExpense={totals.expense}
                            loading={loading}
                        />
                    </div>

                    {/* Row 2 */}
                    {/* Retirement - spans 3 cols */}
                    <div className="col-span-12 md:col-span-6 lg:col-span-3">
                        <RetirementCard />
                    </div>

                    {/* Recurring Services - spans 3 cols */}
                    <div className="col-span-12 md:col-span-6 lg:col-span-3">
                        <RecurringServicesCard />
                    </div>

                    {/* Investment - spans 3 cols */}
                    <div className="col-span-12 md:col-span-6 lg:col-span-3">
                        <InvestmentCard />
                    </div>

                    {/* Business - spans 3 cols */}
                    <div className="col-span-12 md:col-span-6 lg:col-span-3">
                        <BusinessCard />
                    </div>
                </div>
            </div>

            {/* Add Transaction Modal */}
            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddTransaction}
                categories={categories}
            />

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-background-card p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4 border border-border">
                        <h3 className="text-lg font-bold text-text-primary mb-2">¿Eliminar transacción?</h3>
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
        </div>
    );
}
