"use client";

import { formatCurrency } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

interface ReportsCardProps {
    totalIncome?: number;
    totalExpense?: number;
    monthlyBalance?: number;
    chartData?: { value: number; label?: string }[];
}

export function ReportsCard({
    totalIncome = 0,
    totalExpense = 0,
    monthlyBalance,
    chartData = []
}: ReportsCardProps) {
    // Generate mock chart data if not provided or empty
    const data = chartData.length > 0 ? chartData : [
        { value: 60 },
        { value: 80 },
        { value: 40 },
        { value: 90 },
        { value: 55 },
        { value: 75 },
        { value: 45 },
    ];

    // Calculate max value for normalization
    const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid division by zero

    return (
        <div className="bg-background-card rounded-2xl p-5 card-hover border border-border-subtle h-full flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-text-primary">Reportes</h3>
                <TrendingUp className="w-4 h-4 text-text-muted" />
            </div>

            {/* Stats Row */}
            <div className="flex items-baseline gap-4 mb-4">
                <div>
                    <span className="text-2xl font-bold text-text-primary">
                        {formatCurrency(totalIncome)}
                    </span>
                    <p className="text-xs text-text-muted mt-0.5">Ingresos</p>
                </div>
                <div>
                    <span className="text-lg font-semibold text-accent-red">
                        {formatCurrency(totalExpense)}
                    </span>
                    <p className="text-xs text-text-muted mt-0.5">Gastos</p>
                </div>
            </div>

            {/* Mini Bar Chart */}
            <div className="flex items-end gap-1 h-20">
                {data.map((bar, index) => {
                    const heightPercent = (bar.value / maxValue) * 100;
                    return (
                        <div
                            key={index}
                            className="flex-1 rounded-t-sm transition-all duration-300 hover:opacity-80"
                            title={bar.label}
                            style={{
                                height: `${Math.max(heightPercent, 5)}%`, // Min height for visibility
                                backgroundColor: "#22c55e",
                            }}
                        />
                    );
                })}
            </div>

            {/* Bottom Stats */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-subtle">
                <span className="text-lg font-bold text-primary">
                    {formatCurrency(monthlyBalance ?? (totalIncome - totalExpense))}
                </span>
                <span className="text-xs text-text-muted">Balance del mes</span>
            </div>
        </div>
    );
}
