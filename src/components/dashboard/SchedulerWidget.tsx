"use client";

import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { AddCalendarEventModal } from "./AddCalendarEventModal";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";

// Get current month days
const getDaysInMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const days: (number | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
        days.push(null);
    }

    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    return days;
};

const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const today = new Date().getDate();

export function SchedulerWidget() {
    const days = getDaysInMonth();
    const currentMonthStr = new Date().toLocaleString("es-MX", { month: "long", year: "numeric" });

    // State
    const [isIdModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // Hooks
    const { events, add } = useCalendarEvents();

    const handleDayClick = (day: number) => {
        const now = new Date();
        const date = new Date(now.getFullYear(), now.getMonth(), day);
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    const handleAddEvent = async (data: { date: string; title: string; amount?: number }) => {
        await add(data);
    };

    // Helper to check if a day has events
    const hasEvent = (day: number) => {
        if (!day) return false;
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.some(e => e.date === dateStr);
    };

    return (
        <>
            <div className="bg-background-card rounded-2xl p-5 card-hover border border-border-subtle h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-text-primary">Calendario</h3>
                    <button
                        onClick={() => {
                            setSelectedDate(new Date());
                            setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg hover:bg-background-elevated transition-colors"
                    >
                        <Plus className="w-4 h-4 text-text-secondary" />
                    </button>
                </div>

                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-4">
                    <button className="p-1 hover:bg-background-elevated rounded-lg transition-colors">
                        <ChevronLeft className="w-4 h-4 text-text-muted" />
                    </button>
                    <span className="text-sm font-medium text-text-secondary capitalize">{currentMonthStr}</span>
                    <button className="p-1 hover:bg-background-elevated rounded-lg transition-colors">
                        <ChevronRight className="w-4 h-4 text-text-muted" />
                    </button>
                </div>

                {/* Week Days Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDays.map((day) => (
                        <div key={day} className="text-center text-xs text-text-muted py-1">
                            {day.slice(0, 2)}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                    {days.map((day, i) => {
                        const isToday = day === today;
                        const hasEvt = day ? hasEvent(day) : false;

                        return (
                            <div
                                key={i}
                                onClick={() => day && handleDayClick(day)}
                                className={`
                                    relative aspect-square flex flex-col items-center justify-center text-xs rounded-lg transition-all
                                    ${day === null ? "" : "hover:bg-background-elevated cursor-pointer hover:border-accent-primary/50 border border-transparent"}
                                    ${isToday ? "bg-accent-primary text-white font-semibold shadow-lg shadow-accent-primary/25" : "text-text-secondary"}
                                `}
                            >
                                {day}
                                {hasEvt && (
                                    <span className={`absolute bottom-1 w-1 h-1 rounded-full ${isToday ? "bg-white" : "bg-accent-primary"}`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <AddCalendarEventModal
                isOpen={isIdModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddEvent}
                selectedDate={selectedDate}
            />
        </>
    );
}
