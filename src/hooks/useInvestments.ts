import { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/auth-context";
import {
    getInvestments,
    addInvestment as addInvestmentService,
    deleteInvestment as deleteInvestmentService,
} from "@/lib/firebase/firestore";
import type { Investment } from "@/types/database";

export function useInvestments() {
    const { user } = useAuth();
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchInvestments = async () => {
        if (!user) return;
        try {
            const data = await getInvestments(user.uid);
            setInvestments(data);
        } catch (error) {
            console.error("Error fetching investments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvestments();
    }, [user]);

    const add = async (data: { name: string; amount: number; type: string; date: string }) => {
        if (!user) return;
        try {
            const id = await addInvestmentService(user.uid, data);
            // Optimistic update
            const newInvestment: Investment = {
                id,
                user_id: user.uid,
                ...data,
                type: data.type as any, // Type assertion for now
                created_at: new Date().toISOString(),
            };
            setInvestments((prev) => [newInvestment, ...prev]);
        } catch (error) {
            console.error("Error adding investment:", error);
            throw error;
        }
    };

    const remove = async (id: string) => {
        try {
            await deleteInvestmentService(id);
            setInvestments((prev) => prev.filter((i) => i.id !== id));
        } catch (error) {
            console.error("Error deleting investment:", error);
            throw error;
        }
    };

    // Calculate totals
    const totalMarketValue = investments.reduce((sum, inv) => sum + inv.amount, 0);

    return {
        investments,
        loading,
        add,
        remove,
        totalMarketValue,
    };
}
