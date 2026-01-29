"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth-context";
import { cn, formatCurrency } from "@/lib/utils";
import { NAV_ITEMS, ACCOUNT_ITEMS } from "@/lib/constants";
import {
    LayoutDashboard,
    PiggyBank,
    Calendar,
    BarChart3,
    List,
    Wallet,
    CreditCard,
    Briefcase,
    HandCoins,
    Building,
    TrendingUp,
    Plus,
    LogOut,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
    LayoutDashboard,
    PiggyBank,
    Calendar,
    BarChart3,
    List,
    Wallet,
    CreditCard,
    Briefcase,
    HandCoins,
    Building,
    TrendingUp,
};

export function Sidebar() {
    const pathname = usePathname();
    const { user, profile, signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-background-card border-r border-border flex flex-col">
            {/* Logo */}
            <div className="p-6">
                <h1 className="text-xl font-bold gradient-text">DailySpend</h1>
                {profile && (
                    <p className="text-xs text-text-muted mt-1 truncate">
                        {profile.full_name || user?.email}
                    </p>
                )}
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-3 overflow-y-auto">
                <ul className="space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const Icon = iconMap[item.icon];
                        const isActive = pathname === item.href;

                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-primary text-white shadow-glow"
                                            : "text-text-secondary hover:text-text-primary hover:bg-background-elevated"
                                    )}
                                >
                                    {Icon && <Icon className="w-5 h-5" />}
                                    {item.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Accounts Section */}
                <div className="mt-8">
                    <h3 className="px-4 text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                        Accounts
                    </h3>
                    <ul className="space-y-1">
                        {ACCOUNT_ITEMS.map((item) => {
                            const Icon = iconMap[item.icon];
                            const isActive = pathname === item.href;

                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all duration-200",
                                            isActive
                                                ? "bg-background-elevated text-text-primary"
                                                : "text-text-secondary hover:text-text-primary hover:bg-background-elevated"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            {Icon && <Icon className="w-4 h-4" />}
                                            <span>{item.name}</span>
                                        </div>
                                        {item.balance !== null && (
                                            <span className={cn(
                                                "text-xs font-medium",
                                                item.balance >= 0 ? "text-primary" : "text-accent-red"
                                            )}>
                                                {formatCurrency(item.balance)}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-border">
                <div className="flex items-center justify-between">
                    <button className="w-12 h-12 rounded-full bg-primary hover:bg-primary-hover transition-colors flex items-center justify-center shadow-glow">
                        <Plus className="w-6 h-6 text-white" />
                    </button>
                    <button
                        onClick={handleSignOut}
                        className="p-3 rounded-xl text-text-muted hover:text-accent-red hover:bg-background-elevated transition-colors"
                        title="Cerrar sesión"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
