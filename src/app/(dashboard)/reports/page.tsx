"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { useTransactions, useCategories } from "@/hooks";
import { formatCurrency } from "@/lib/utils";
import { Download, TrendingUp, TrendingDown, Calendar, Trash2 } from "lucide-react";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { IncomeExpenseChart } from "@/components/dashboard/IncomeExpenseChart";

const COLORS = ["#22c55e", "#3b82f6", "#f97316", "#a855f7", "#ec4899", "#eab308"];

type TimeFilter = "day" | "week" | "month" | "year" | "custom";

export default function ReportsPage() {
    const { transactions, totals, balance, loading, remove } = useTransactions();
    const { categories } = useCategories();
    const [timeFilter, setTimeFilter] = useState<TimeFilter>("day");

    // Custom date range state
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");

    // Filter transactions by time
    const filteredTransactions = useMemo(() => {
        const now = new Date();
        let startDate: Date;
        let endDate: Date = now;

        switch (timeFilter) {
            case "day":
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
                break;
            case "week":
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case "month":
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case "year":
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            case "custom":
                if (!customStart) return transactions;
                startDate = new Date(customStart + "T00:00:00");
                if (customEnd) {
                    endDate = new Date(customEnd + "T23:59:59");
                }
                break;
            default:
                startDate = new Date(0); // All time if needed, though default is month
        }

        return transactions.filter((t) => {
            const txDate = new Date(t.date);
            // Fix timezone offset issue by comparing timestamps or using UTC
            // Simple comparison:
            return txDate >= startDate && txDate <= endDate;
        });
    }, [transactions, timeFilter, customStart, customEnd]);

    // Calculate category breakdown for pie chart
    const categoryData = useMemo(() => {
        const expenses = filteredTransactions.filter((t) => t.type === "expense");
        const categoryTotals: Record<string, number> = {};

        expenses.forEach((t) => {
            const cat = categories.find((c) => c.id === t.category_id);
            const name = cat?.name || "Otro";
            categoryTotals[name] = (categoryTotals[name] || 0) + t.amount;
        });

        return Object.entries(categoryTotals).map(([name, value], index) => ({
            name,
            value,
            color: COLORS[index % COLORS.length],
        }));
    }, [filteredTransactions, categories]);

    // Calculate monthly data for bar chart
    const monthlyData = useMemo(() => {
        const months: Record<string, { income: number; expense: number }> = {};
        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

        transactions.slice(0).reverse().forEach((t) => { // Use all transactions for bar chart context? Or filtered? Usually bar chart shows trends over time, so maybe last 6 months is better than just the filtered range if the range is small. Let's keep it as last 6 months global for now, or adapt to filter? 
            // Instructions implication: "Insights analíticas... comparativa... en los últimos 6 meses". 
            // Let's stick to last 6 months for the bar chart regardless of filter to show trends, OR if the user wants reports for a specific period, maybe they want the bar chart to reflect that too?
            // Standard generally is: Summary cards & Transaction list obey the filter. Trend chart often is fixed or adapts.
            // Let's make the trend chart obey the filter if it's broad, but "Last 6 months" implies a fixed view. 
            // However, if I select "Year", I want to see the whole year breakdown.
            // Let's make the bar chart aggregate based on the filtered data, grouping by month.

            const date = new Date(t.date);
            // Only include if in filteredTransactions?
            // If I filter by "Week", a monthly bar chart is useless (1 bar?).
            // If I filter by "Custom", I might want to see the breakdown.
            // Let's use filteredTransactions for consistency across all widgets.
        });

        // Re-implementing logic to use filteredTransactions for consistency
        const data: Record<string, { income: number; expense: number }> = {};

        filteredTransactions.forEach(t => {
            const date = new Date(t.date);
            const key = `${date.getFullYear()}-${date.getMonth()}`; // Group by month
            if (!data[key]) data[key] = { income: 0, expense: 0 };
            if (t.type === 'income') data[key].income += t.amount;
            else data[key].expense += t.amount;
        });

        // Sort keys
        return Object.keys(data).sort().map(key => {
            const [year, month] = key.split('-').map(Number);
            return {
                name: monthNames[month],
                ingresos: data[key].income,
                gastos: data[key].expense
            };
        });
    }, [filteredTransactions]);

    // Revert to original logic for BarChart specifically requested "Last 6 months" in requirements?
    // Requirement RF-07: "Comparativa ... en los últimos 6 meses".
    // So the bar chart should PROBABLY be fixed to last 6 months or year, independent of the small "time filter" which is for the list/summary.
    // BUT, if I filter by "Year", I expect the chart to show the year.
    // Let's stick to the previous implementation for the Bar Chart (Last 6 months fixed) to satisfy the specific requirement RF-07, 
    // OR make it dynamic. The previous code did: `transactions.forEach... slice(-6)`.
    // Let's keep the previous logic for the Bar Chart to ensure we meet "Last 6 months" specifically, unless the user explicitly requested otherwise. 
    // Actually, "Reports" page usually implies analyzing the data selected. 
    // Let's stick to the previous implementation for the Bar Chart as it was already working and likely acceptable.
    // I will just Refactor it to use the component.

    const barChartData = useMemo(() => {
        const months: Record<string, { income: number; expense: number }> = {};
        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

        transactions.forEach((t) => {
            const date = new Date(t.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

            if (!months[monthKey]) {
                months[monthKey] = { income: 0, expense: 0 };
            }

            if (t.type === "income") {
                months[monthKey].income += t.amount;
            } else {
                months[monthKey].expense += t.amount;
            }
        });

        return Object.entries(months)
            .sort((a, b) => { // Sort by date
                const [yA, mA] = a[0].split('-').map(Number);
                const [yB, mB] = b[0].split('-').map(Number);
                return new Date(yA, mA).getTime() - new Date(yB, mB).getTime();
            })
            .slice(-6)
            .map(([key, data]) => ({
                name: monthNames[parseInt(key.split("-")[1])],
                ingresos: data.income,
                gastos: data.expense,
            }));
    }, [transactions]);


    // Export to Excel
    const handleExport = async () => {
        try {
            const ExcelJS = (await import("exceljs")).default;
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Transacciones");

            // Headers
            worksheet.columns = [
                { header: "Fecha", key: "date", width: 15 },
                { header: "Tipo", key: "type", width: 10 },
                { header: "Categoría", key: "category", width: 15 },
                { header: "Descripción", key: "description", width: 30 },
                { header: "Monto", key: "amount", width: 15 },
            ];

            // Style headers
            worksheet.getRow(1).font = { bold: true };
            worksheet.getRow(1).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF22C55E" },
            };

            // Add data - Use filteredTransactions to export what is seen
            filteredTransactions.forEach((t) => {
                const cat = categories.find((c) => c.id === t.category_id);
                worksheet.addRow({
                    date: new Date(t.date).toLocaleDateString("es-MX"),
                    type: t.type === "income" ? "Ingreso" : "Gasto",
                    category: cat?.name || "Otro",
                    description: t.description || "",
                    amount: t.amount,
                });
            });

            // Generate and download
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `DailySpend_Reporte_${new Date().toISOString().split("T")[0]}.xlsx`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error exporting:", error);
            alert("Error al exportar. Intenta de nuevo.");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar esta transacción?")) {
            await remove(id);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Header title="Reportes" />

            <div className="px-8 pb-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    <div className="bg-background-card rounded-2xl p-6 border border-border">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary/20">
                                <TrendingUp className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-text-secondary">Total Ingresos</span>
                        </div>
                        <p className="text-2xl font-bold text-primary">{formatCurrency(totals.income)}</p>
                    </div>

                    <div className="bg-background-card rounded-2xl p-6 border border-border">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-accent-red/20">
                                <TrendingDown className="w-5 h-5 text-accent-red" />
                            </div>
                            <span className="text-text-secondary">Total Gastos</span>
                        </div>
                        <p className="text-2xl font-bold text-accent-red">{formatCurrency(totals.expense)}</p>
                    </div>

                    <div className="bg-background-card rounded-2xl p-6 border border-border">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-blue-500/20">
                                <Calendar className="w-5 h-5 text-blue-500" />
                            </div>
                            <span className="text-text-secondary">Balance</span>
                        </div>
                        <p className={`text-2xl font-bold ${balance >= 0 ? "text-primary" : "text-accent-red"}`}>
                            {formatCurrency(balance)}
                        </p>
                    </div>
                </div>

                {/* Time Filter & Export */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex flex-wrap items-center gap-2">
                        {(["day", "week", "month", "year", "custom"] as const).map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setTimeFilter(filter)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${timeFilter === filter
                                    ? "bg-primary text-white"
                                    : "bg-background-card text-text-secondary hover:bg-background-elevated"
                                    }`}
                            >
                                {filter === "day" ? "Día" : filter === "week" ? "Semana" : filter === "month" ? "Mes" : filter === "year" ? "Año" : "Personalizado"}
                            </button>
                        ))}

                        {/* Custom Date Inputs */}
                        {timeFilter === "custom" && (
                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-5">
                                <input
                                    type="date"
                                    value={customStart}
                                    onChange={(e) => setCustomStart(e.target.value)}
                                    className="bg-background-card border border-border-subtle rounded-lg px-3 py-1.5 text-sm"
                                />
                                <span className="text-text-muted">-</span>
                                <input
                                    type="date"
                                    value={customEnd}
                                    onChange={(e) => setCustomEnd(e.target.value)}
                                    className="bg-background-card border border-border-subtle rounded-lg px-3 py-1.5 text-sm"
                                />
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover rounded-xl text-white font-medium transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Exportar Excel
                    </button>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <CategoryPieChart data={categoryData} />
                    <IncomeExpenseChart data={barChartData} />
                </div>

                {/* Transaction History */}
                <div className="mt-6 bg-background-card rounded-2xl p-6 border border-border">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">
                        Historial de Transacciones ({filteredTransactions.length})
                    </h3>
                    {filteredTransactions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left py-3 px-4 text-text-muted font-medium">Fecha</th>
                                        <th className="text-left py-3 px-4 text-text-muted font-medium">Categoría</th>
                                        <th className="text-left py-3 px-4 text-text-muted font-medium">Descripción</th>
                                        <th className="text-right py-3 px-4 text-text-muted font-medium">Monto</th>
                                        <th className="text-right py-3 px-4 text-text-muted font-medium">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.map((t) => {
                                        const cat = categories.find((c) => c.id === t.category_id);
                                        return (
                                            <tr key={t.id} className="border-b border-border-subtle hover:bg-background-elevated">
                                                <td className="py-3 px-4 text-text-secondary">
                                                    {new Date(t.date).toLocaleDateString("es-MX")}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="flex items-center gap-2">
                                                        <span>{cat?.icon || "💰"}</span>
                                                        <span className="text-text-primary">{cat?.name || "Otro"}</span>
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-text-secondary">{t.description || "-"}</td>
                                                <td className={`py-3 px-4 text-right font-semibold ${t.type === "income" ? "text-primary" : "text-accent-red"
                                                    }`}>
                                                    {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <button
                                                        onClick={() => handleDelete(t.id)}
                                                        className="p-2 hover:bg-accent-red/10 rounded-lg text-text-muted hover:text-accent-red transition-colors"
                                                        title="Eliminar transacción"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-text-muted py-8">No hay transacciones en este período</p>
                    )}
                </div>
            </div>
        </div>
    );
}
