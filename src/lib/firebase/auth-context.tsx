"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase/config";
import type { Profile } from "@/types/database";

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);

            if (user) {
                // Fetch user profile from Firestore
                const profileDoc = await getDoc(doc(db, "profiles", user.uid));
                if (profileDoc.exists()) {
                    setProfile(profileDoc.data() as Profile);
                }
            } else {
                setProfile(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Sign in with email/password
    const signIn = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    // Sign up with email/password
    const signUp = async (email: string, password: string, name: string) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);

        // Create user profile in Firestore
        const newProfile: Profile = {
            id: result.user.uid,
            full_name: name,
            currency: "MXN",
            updated_at: new Date().toISOString(),
        };

        await setDoc(doc(db, "profiles", result.user.uid), newProfile);
        setProfile(newProfile);
    };

    // Sign in with Google
    const signInWithGoogle = async () => {
        const result = await signInWithPopup(auth, googleProvider);

        // Check if profile exists, create if not
        const profileDoc = await getDoc(doc(db, "profiles", result.user.uid));

        if (!profileDoc.exists()) {
            const newProfile: Profile = {
                id: result.user.uid,
                full_name: result.user.displayName || "Usuario",
                currency: "MXN",
                updated_at: new Date().toISOString(),
            };
            await setDoc(doc(db, "profiles", result.user.uid), newProfile);
            setProfile(newProfile);
        } else {
            setProfile(profileDoc.data() as Profile);
        }
    };

    // Sign out
    const signOut = async () => {
        await firebaseSignOut(auth);
        setUser(null);
        setProfile(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                loading,
                signIn,
                signUp,
                signInWithGoogle,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
