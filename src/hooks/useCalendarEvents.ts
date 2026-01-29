import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';
import { getCalendarEvents, addCalendarEvent, deleteCalendarEvent } from '@/lib/firebase/firestore';
import type { CalendarEvent } from '@/types/database';

export function useCalendarEvents() {
    const { user } = useAuth();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadEvents();
        }
    }, [user]);

    const loadEvents = async () => {
        if (!user) return;
        try {
            const data = await getCalendarEvents(user.uid);
            setEvents(data);
        } catch (error) {
            console.error('Error loading calendar events:', error);
        } finally {
            setLoading(false);
        }
    };

    const add = async (data: { date: string; title: string; amount?: number }) => {
        if (!user) return;
        try {
            await addCalendarEvent(user.uid, {
                ...data,
                type: 'note' // Simplified for now, can be expanded
            });
            await loadEvents();
        } catch (error) {
            console.error('Error adding calendar event:', error);
            throw error;
        }
    };

    const remove = async (id: string) => {
        try {
            await deleteCalendarEvent(id);
            setEvents(prev => prev.filter(e => e.id !== id));
        } catch (error) {
            console.error('Error deleting calendar event:', error);
            throw error;
        }
    };

    return { events, loading, add, remove, refresh: loadEvents };
}
