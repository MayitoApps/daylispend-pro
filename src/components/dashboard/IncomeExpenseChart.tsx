"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface MonthlyData {
    name: string;
    ingresos: number;
    gastos: number;
}

interface IncomeExpenseChartProps {
    data: MonthlyData[];
}

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
    return (
        <div className="bg-background-card rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Ingresos vs Gastos</h3>
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                        <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #27272a", borderRadius: "8px" }}
                            itemStyle={{ color: "#e4e4e7" }}
                            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: "10px" }} />
                        <Bar dataKey="ingresos" name="Ingresos" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={50} />
                        <Bar dataKey="gastos" name="Gastos" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={50} />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-[300px] flex items-center justify-center text-text-muted">
                    No hay datos para mostrar
                </div>
            )}
        </div>
    );
}
