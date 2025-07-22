// app/page.tsx
import React from "react";
import {Metadata} from "next";
import Hero from "@/app/components/Home/Hero";
import Services from "@/app/components/Home/Services";
import Features from "@/app/components/Home/Features";
import ProductDoc from "@/app/components/Home/ProductDoc";
import FAQ from "@/app/components/Home/FAQ";
import Info from "@/app/components/Home/Info";
import Partners from "@/app/components/Home/Partner";
import KegiatanPreview from "@/app/components/Home/KegiatanPreview";

export const metadata: Metadata = {
    title: "Keliling Keling",
};

export default function Home() {
    return (
        <main>
            <Hero />
            <Features />
            <Services />
            <ProductDoc />
            <KegiatanPreview />
            <FAQ />
            <Info />
            <Partners />
        </main>
    );
}
