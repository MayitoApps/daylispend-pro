"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface CategoryData {
    name: string;
    value: number;
    color: string;
}

interface CategoryPieChartProps {
    data: CategoryData[];
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
    return (
        <div className="bg-background-card rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Gastos por Categoría</h3>
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #27272a", borderRadius: "8px" }}
                            itemStyle={{ color: "#e4e4e7" }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-[300px] flex items-center justify-center text-text-muted">
                    No hay gastos para mostrar
                </div>
            )}
        </div>
    );
}
