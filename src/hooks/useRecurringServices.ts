"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/auth-context";
import {
    getRecurringServices,
    addRecurringService,
    deleteRecurringService,
} from "@/lib/firebase/firestore";
import type { RecurringService } from "@/types/database";

export function useRecurringServices() {
    const { user } = useAuth();
    const [services, setServices] = useState<RecurringService[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchServices = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const data = await getRecurringServices(user.uid);
            setServices(data);
        } catch (err) {
            console.error("Error fetching services:", err);
        } finally {
            setLoading(false);
        }
    };

    const add = async (data: { name: string; day_of_month: number; amount: number }) => {
        console.log("Adding service:", data);
        if (!user) {
            console.error("User not authenticated");
            alert("Error: Usuario no autenticado");
            return;
        }
        try {
            console.log("Calling addRecurringService with uid:", user.uid);
            const id = await addRecurringService(user.uid, data);
            console.log("Service added with ID:", id);

            const newService: RecurringService = {
                id,
                user_id: user.uid,
                ...data,
                created_at: new Date().toISOString(),
            };
            setServices((prev) => [...prev, newService].sort((a, b) => a.day_of_month - b.day_of_month));
            return id;
        } catch (err) {
            console.error("Error adding service:", err);
            alert(`Error al guardar: ${err}`);
            throw err;
        }
    };

    const remove = async (id: string) => {
        try {
            await deleteRecurringService(id);
            setServices((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            console.error("Error deleting service:", err);
            throw err;
        }
    };

    useEffect(() => {
        fetchServices();
    }, [user]);

    return { services, loading, add, remove };
}
