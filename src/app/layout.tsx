import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RBAC Secure Hub - Login",
  description: "A secure Role-Based Access Control dashboard built with Next.js, Tailwind CSS, MySQL and JWT authentication.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} antialiased min-h-full bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
