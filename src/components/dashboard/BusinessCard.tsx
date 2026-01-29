"use client";

import { Plus } from "lucide-react";

const chartData = [
    { name: "Shell", value: 42, color: "#22c55e" },
    { name: "Starbucks", value: 25, color: "#3b82f6" },
    { name: "Dropbox", value: 18, color: "#a855f7" },
    { name: "McDonalds", value: 15, color: "#f97316" },
];

export function BusinessCard() {
    const totalPercentage = chartData.reduce((acc, item) => acc + item.value, 0);

    return (
        <div className="bg-background-card rounded-2xl card-hover border border-border-subtle h-full min-h-[350px] overflow-hidden relative">
            <img
                src="/scrooge-money.png"
                alt="Rico McPato contando dinero"
                className="w-full h-full object-cover"
            />
        </div>
    );
}
