"use client";

import { Plus, ArrowDownLeft } from "lucide-react";

export function CreditCardVisual() {
    const cardNumber = "9301 2321 3332 9632";
    const cardHolder = "Jerome Cash";
    const balance = 3578;

    return (
        <div className="bg-background-card rounded-2xl p-5 card-hover border border-border-subtle h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-text-primary">Credit Card</h3>
                <button className="p-1.5 rounded-lg hover:bg-background-elevated transition-colors">
                    <Plus className="w-4 h-4 text-text-secondary" />
                </button>
            </div>

            {/* Credit Card */}
            <div className="relative w-full aspect-[1.6/1] bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 rounded-xl p-4 overflow-hidden shadow-lg">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white" />
                    <div className="absolute -right-4 top-8 w-24 h-24 rounded-full bg-white" />
                </div>

                {/* Visa Logo */}
                <div className="absolute top-4 right-4">
                    <span className="text-white text-xl font-bold italic">VISA</span>
                </div>

                {/* Chip */}
                <div className="w-10 h-7 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-md mb-6" />

                {/* Card Number */}
                <p className="text-white text-sm font-mono tracking-wider mb-3">
                    {cardNumber}
                </p>

                {/* Card Holder & Balance */}
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-white/60 text-xs mb-1">{cardHolder}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <ArrowDownLeft className="w-3 h-3 text-white/60" />
                        <span className="text-white/60 text-xs">Balance</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
