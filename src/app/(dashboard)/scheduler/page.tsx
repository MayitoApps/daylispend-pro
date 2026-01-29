"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { useTransactions, useCategories } from "@/hooks";
import { formatCurrency } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { AddTransactionModal } from "@/components/dashboard";

export default function SchedulerPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const { transactions, add } = useTransactions();
    const { categories } = useCategories();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    // Group transactions by date
    const transactionsByDate = useMemo(() => {
        const grouped: Record<string, typeof transactions> = {};
        transactions.forEach((t) => {
            const dateKey = t.date.split("T")[0];
            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(t);
        });
        return grouped;
    }, [transactions]);

    // Navigate months
    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    // Build calendar
    const calendarDays: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
        calendarDays.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i);
    }

    const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const today = new Date();
    const isToday = (day: number) =>
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

    const getDateKey = (day: number) =>
        `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    return (
        <div className="min-h-screen">
            <Header title="Calendario" onAddClick={() => setIsModalOpen(true)} />

            <div className="px-8 pb-8">
                {/* Calendar Card */}
                <div className="bg-background-card rounded-2xl p-6 border border-border">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={prevMonth}
                            className="p-2 hover:bg-background-elevated rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-text-muted" />
                        </button>
                        <h2 className="text-xl font-semibold text-text-primary">
                            {monthNames[month]} {year}
                        </h2>
                        <button
                            onClick={nextMonth}
                            className="p-2 hover:bg-background-elevated rounded-lg transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-text-muted" />
                        </button>
                    </div>

                    {/* Week Days Header */}
                    <div className="grid grid-cols-7 gap-2 mb-2">
                        {weekDays.map((day) => (
                            <div
                                key={day}
                                className="text-center text-sm font-medium text-text-muted py-2"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                        {calendarDays.map((day, index) => {
                            const dateKey = day ? getDateKey(day) : "";
                            const dayTransactions = transactionsByDate[dateKey] || [];
                            const hasTransactions = dayTransactions.length > 0;
                            const dayTotal = dayTransactions.reduce((sum, t) => {
                                return t.type === "expense" ? sum - t.amount : sum + t.amount;
                            }, 0);

                            return (
                                <div
                                    key={index}
                                    className={`
                    min-h-[80px] p-2 rounded-xl border transition-colors
                    ${day === null ? "border-transparent" : "border-border-subtle hover:border-border"}
                    ${isToday(day || 0) ? "bg-primary/10 border-primary" : ""}
                  `}
                                >
                                    {day !== null && (
                                        <>
                                            <span
                                                className={`
                          text-sm font-medium
                          ${isToday(day) ? "text-primary" : "text-text-secondary"}
                        `}
                                            >
                                                {day}
                                            </span>
                                            {hasTransactions && (
                                                <div className="mt-1">
                                                    <div
                                                        className={`
                              text-xs font-semibold px-1.5 py-0.5 rounded
                              ${dayTotal >= 0 ? "bg-primary/20 text-primary" : "bg-accent-red/20 text-accent-red"}
                            `}
                                                    >
                                                        {dayTotal >= 0 ? "+" : ""}{formatCurrency(Math.abs(dayTotal))}
                                                    </div>
                                                    <div className="text-xs text-text-muted mt-0.5">
                                                        {dayTransactions.length} mov.
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Monthly Summary */}
                <div className="mt-6 bg-background-card rounded-2xl p-6 border border-border">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">
                        Resumen de {monthNames[month]}
                    </h3>

                    {(() => {
                        const monthTransactions = transactions.filter((t) => {
                            const d = new Date(t.date);
                            return d.getMonth() === month && d.getFullYear() === year;
                        });

                        const monthIncome = monthTransactions
                            .filter((t) => t.type === "income")
                            .reduce((sum, t) => sum + t.amount, 0);

                        const monthExpense = monthTransactions
                            .filter((t) => t.type === "expense")
                            .reduce((sum, t) => sum + t.amount, 0);

                        return (
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-background-elevated rounded-xl p-4">
                                    <p className="text-text-muted text-sm">Ingresos</p>
                                    <p className="text-xl font-bold text-primary">{formatCurrency(monthIncome)}</p>
                                </div>
                                <div className="bg-background-elevated rounded-xl p-4">
                                    <p className="text-text-muted text-sm">Gastos</p>
                                    <p className="text-xl font-bold text-accent-red">{formatCurrency(monthExpense)}</p>
                                </div>
                                <div className="bg-background-elevated rounded-xl p-4">
                                    <p className="text-text-muted text-sm">Balance</p>
                                    <p className={`text-xl font-bold ${monthIncome - monthExpense >= 0 ? "text-primary" : "text-accent-red"}`}>
                                        {formatCurrency(monthIncome - monthExpense)}
                                    </p>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={add}
                categories={categories}
            />
        </div>
    );
}
