"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth-context";
import { Eye, EyeOff, Mail, Lock, User, LogIn } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const { signIn, signUp, signInWithGoogle, loading } = useAuth();

    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            if (isLogin) {
                await signIn(formData.email, formData.password);
            } else {
                await signUp(formData.email, formData.password, formData.name);
            }
            router.push("/");
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Error de autenticación";
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError("");
        try {
            await signInWithGoogle();
            router.push("/");
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Error con Google";
            setError(errorMessage);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold gradient-text mb-2">DailySpend</h1>
                    <p className="text-text-secondary">
                        {isLogin ? "Inicia sesión en tu cuenta" : "Crea tu cuenta"}
                    </p>
                </div>

                {/* Card */}
                <div className="bg-background-card rounded-2xl p-8 border border-border">
                    {/* Error message */}
                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-accent-red/10 border border-accent-red/20 text-accent-red text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name (only for signup) */}
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Nombre
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-background-elevated rounded-xl border border-border focus:border-primary focus:outline-none text-text-primary placeholder:text-text-muted transition-colors"
                                        placeholder="Tu nombre"
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-background-elevated rounded-xl border border-border focus:border-primary focus:outline-none text-text-primary placeholder:text-text-muted transition-colors"
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-10 pr-12 py-3 bg-background-elevated rounded-xl border border-border focus:border-primary focus:outline-none text-text-primary placeholder:text-text-muted transition-colors"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium text-white transition-colors flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-sm text-text-muted">o continúa con</span>
                        <div className="flex-1 h-px bg-border" />
                    </div>

                    {/* Google Button */}
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full py-3 bg-background-elevated hover:bg-background border border-border rounded-xl font-medium text-text-primary transition-colors flex items-center justify-center gap-3"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Google
                    </button>

                    {/* Toggle Login/Signup */}
                    <p className="text-center text-text-secondary mt-6">
                        {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-primary hover:underline font-medium"
                        >
                            {isLogin ? "Regístrate" : "Inicia Sesión"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
