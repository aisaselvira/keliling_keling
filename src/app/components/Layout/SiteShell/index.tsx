// app/components/Layout/SiteShell.tsx
"use client";

import { usePathname } from "next/navigation";
import Header from "../Header";
import Footer from "../Footer";
import ScrollToTop from "../../ScrollToTop";
import { ThemeProvider } from "next-themes";
import SessionProviderComp from "@/app/provider/nextauth/SessionProvider";
import { AuthDialogProvider } from "@/context/AuthDialogContext";
import NextTopLoader from "nextjs-toploader";
import { Manrope } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"] });

type Props = {
  children: React.ReactNode;
  session?: any;
};

export default function SiteShell({ children, session }: Props) {
  const pathname = usePathname();

  // kalau di route admin, jangan tampilkan header/footer/etc
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>; // pure content tanpa layout global
  }

  return (
    <div className={manrope.className}>
      <NextTopLoader color="#2563EB" />
      <AuthDialogProvider>
        <SessionProviderComp session={session}>
          <ThemeProvider attribute="class" enableSystem={false} defaultTheme="light">
            <Header />
            {children}
            <Footer />
            <ScrollToTop />
          </ThemeProvider>
        </SessionProviderComp>
      </AuthDialogProvider>
    </div>
  );
}
