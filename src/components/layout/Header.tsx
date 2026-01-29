"use client";

import { Search, Plus } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface HeaderProps {
    title: string;
    onAddClick?: () => void;
}

export function Header({ title, onAddClick }: HeaderProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("q", term);
        } else {
            params.delete("q");
        }
        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <header className="flex items-center justify-between px-8 py-6">
            <h1 className="text-2xl font-bold text-text-primary">{title}</h1>

            <div className="flex items-center gap-3">
                {/* Search Input */}
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Buscar transacciones..."
                        onChange={(e) => handleSearch(e.target.value)}
                        defaultValue={searchParams.get("q")?.toString()}
                        className="pl-10 pr-4 py-2.5 rounded-xl bg-background-card border border-border-subtle focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary w-64 transition-all"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                </div>

                {/* Add Button */}
                {onAddClick && (
                    <button
                        onClick={onAddClick}
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover rounded-xl text-white font-medium transition-colors shadow-glow"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Agregar</span>
                    </button>
                )}
            </div>
        </header>
    );
}
