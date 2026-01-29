import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    query,
    where,
    orderBy,
    Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Transaction, Category, TransactionFormData, Investment, RecurringService } from "@/types/database";

// ==================== TRANSACTIONS ====================

/**
 * Get all transactions for a user
 */
export async function getTransactions(userId: string): Promise<Transaction[]> {
    const q = query(
        collection(db, "transactions"),
        where("user_id", "==", userId)
    );

    const snapshot = await getDocs(q);
    const transactions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Transaction[];

    // Sort by date desc (client-side to avoid index requirement)
    return transactions.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

/**
 * Add a new transaction
 */
export async function addTransaction(
    userId: string,
    data: TransactionFormData
): Promise<string> {
    const docRef = await addDoc(collection(db, "transactions"), {
        user_id: userId,
        amount: data.amount,
        type: data.type,
        category_id: data.category_id,
        description: data.description,
        date: data.date,
        payment_method: data.payment_method || "cash",
        created_at: Timestamp.now(),
    });

    return docRef.id;
}

/**
 * Update a transaction
 */
export async function updateTransaction(
    transactionId: string,
    data: Partial<TransactionFormData>
): Promise<void> {
    await updateDoc(doc(db, "transactions", transactionId), data);
}

/**
 * Delete a transaction
 */
export async function deleteTransaction(transactionId: string): Promise<void> {
    await deleteDoc(doc(db, "transactions", transactionId));
}

// ==================== CATEGORIES ====================

/**
 * Get all categories for a user (includes default categories)
 */
export async function getCategories(userId: string): Promise<Category[]> {
    // Get user's custom categories
    const userCategoriesQuery = query(
        collection(db, "categories"),
        where("user_id", "==", userId)
    );

    // Get default categories
    const defaultCategoriesQuery = query(
        collection(db, "categories"),
        where("is_default", "==", true)
    );

    const [userSnapshot, defaultSnapshot] = await Promise.all([
        getDocs(userCategoriesQuery),
        getDocs(defaultCategoriesQuery),
    ]);

    const userCategories = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Category[];

    const defaultCategories = defaultSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Category[];

    // Combine and deduplicate
    const allCategories = [...defaultCategories, ...userCategories];
    return allCategories;
}

/**
 * Add a custom category
 */
export async function addCategory(
    userId: string,
    data: { name: string; icon: string; color: string }
): Promise<string> {
    const docRef = await addDoc(collection(db, "categories"), {
        user_id: userId,
        name: data.name,
        icon: data.icon,
        color: data.color,
        is_default: false,
    });

    return docRef.id;
}

/**
 * Update a custom category
 */
export async function updateCategory(
    categoryId: string,
    data: { name: string; icon: string; color: string }
): Promise<void> {
    await updateDoc(doc(db, "categories", categoryId), {
        name: data.name,
        icon: data.icon,
        color: data.color,
    });
}

/**
 * Delete a custom category
 */
export async function deleteCategory(categoryId: string): Promise<void> {
    await deleteDoc(doc(db, "categories", categoryId));
}

/**
 * Initialize default categories in Firestore
 */
export async function initializeDefaultCategories(): Promise<void> {
    const defaultCategories = [
        { name: "Comida", icon: "🍔", color: "#f97316", is_default: true, user_id: null },
        { name: "Ocio", icon: "🎮", color: "#a855f7", is_default: true, user_id: null },
        { name: "Servicios", icon: "💡", color: "#3b82f6", is_default: true, user_id: null },
        { name: "Suscripciones", icon: "📺", color: "#ec4899", is_default: true, user_id: null },
        { name: "Transporte", icon: "🚗", color: "#eab308", is_default: true, user_id: null },
        { name: "Vivienda", icon: "🏠", color: "#22c55e", is_default: true, user_id: null },
    ];

    // Check if defaults already exist
    const q = query(collection(db, "categories"), where("is_default", "==", true));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        // Add default categories
        for (const category of defaultCategories) {
            await addDoc(collection(db, "categories"), category);
        }
    }
}

// ==================== INVESTMENTS ====================

/**
 * Get all investments for a user
 */
export async function getInvestments(userId: string): Promise<Investment[]> {
    const q = query(
        collection(db, "investments"),
        where("user_id", "==", userId),
        orderBy("created_at", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Investment[];
}

/**
 * Add a new investment
 */
export async function addInvestment(
    userId: string,
    data: { name: string; amount: number; type: string; date: string }
): Promise<string> {
    const docRef = await addDoc(collection(db, "investments"), {
        user_id: userId,
        name: data.name,
        amount: data.amount,
        type: data.type,
        date: data.date,
        created_at: Timestamp.now(),
    });

    return docRef.id;
}

/**
 * Delete an investment
 */
export async function deleteInvestment(investmentId: string): Promise<void> {
    await deleteDoc(doc(db, "investments", investmentId));
}

// ==================== RECURRING SERVICES ====================

/**
 * Get all recurring services for a user
 */
export async function getRecurringServices(userId: string): Promise<RecurringService[]> {
    const q = query(
        collection(db, "recurring_services"),
        where("user_id", "==", userId)
        // orderBy("day_of_month", "asc") // Removed to avoid index requirement, sorting done in hook
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as RecurringService[];
}

/**
 * Add a new recurring service
 */
export async function addRecurringService(
    userId: string,
    data: { name: string; day_of_month: number; amount: number }
): Promise<string> {
    const docRef = await addDoc(collection(db, "recurring_services"), {
        user_id: userId,
        name: data.name,
        amount: data.amount,
        day_of_month: data.day_of_month,
        created_at: Timestamp.now(),
    });

    return docRef.id;
}

/**
 * Delete a recurring service
 */
export async function deleteRecurringService(serviceId: string): Promise<void> {
    await deleteDoc(doc(db, "recurring_services", serviceId));
}

// ==================== CALENDAR EVENTS ====================

/**
 * Get all calendar events for a user
 */
export async function getCalendarEvents(userId: string): Promise<import("@/types/database").CalendarEvent[]> {
    const q = query(
        collection(db, "calendar_events"),
        where("user_id", "==", userId)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as import("@/types/database").CalendarEvent[];
}

/**
 * Add a new calendar event
 */
export async function addCalendarEvent(
    userId: string,
    data: { date: string; title: string; type: "payment" | "note"; amount?: number }
): Promise<string> {
    const docRef = await addDoc(collection(db, "calendar_events"), {
        user_id: userId,
        date: data.date,
        title: data.title,
        type: data.type,
        amount: data.amount || 0,
        created_at: Timestamp.now(),
    });

    return docRef.id;
}

/**
 * Delete a calendar event
 */
export async function deleteCalendarEvent(eventId: string): Promise<void> {
    await deleteDoc(doc(db, "calendar_events", eventId));
}
