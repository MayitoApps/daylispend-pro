"use client";

import { Plus, Repeat } from "lucide-react";
import { formatCurrency, formatCompactCurrency } from "@/lib/utils";

export function RetirementCard() {
    const todayDeposit = 100;
    const projectValue = 75000;

    return (
        <div className="bg-background-card rounded-2xl p-5 card-hover border border-border-subtle h-full min-h-[350px] flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-text-primary">Retirement</h3>
                <button className="p-1.5 rounded-lg hover:bg-background-elevated transition-colors">
                    <Plus className="w-4 h-4 text-text-secondary" />
                </button>
            </div>

            {/* Today Deposit */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Repeat className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <p className="text-lg font-bold text-text-primary flex items-center gap-1">
                        <span className="text-text-muted">$</span>
                        {todayDeposit}
                    </p>
                    <p className="text-xs text-text-muted">Today Deposit</p>
                </div>
            </div>

            {/* Project Value */}
            <div className="bg-primary/10 rounded-xl p-4">
                <p className="text-2xl font-bold text-primary mb-1">
                    $ {projectValue.toLocaleString()}
                </p>
                <p className="text-xs text-text-muted">
                    Project Value at age is $30.
                </p>
            </div>
        </div>
    );
}
