import type { Metadata } from "next";
import { AuthProvider } from "@/lib/firebase/auth-context";
import "./globals.css";

export const metadata: Metadata = {
    title: "DailySpend Pro - Gestión Financiera Personal",
    description: "Sistema de gestión de finanzas personales con dashboard interactivo, categorización inteligente y reportes exportables.",
    keywords: ["finanzas personales", "control de gastos", "presupuesto", "ahorro"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" className="dark">
            <body className="min-h-screen bg-background antialiased">
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
