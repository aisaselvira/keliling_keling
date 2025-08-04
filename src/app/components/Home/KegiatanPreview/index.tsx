"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {Icon} from "@iconify/react";
import KegiatanCard from "@/app/components/SharedComponent/Kegiatan/kegiatanCard";

const KegiatanPreview = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await fetch("https://keliling-keling-backend-98321.vercel.app/api/article");
                if (!res.ok) throw new Error("Gagal mengambil data kegiatan");
                const data = await res.json();
                setPosts(data); 
            } catch (err) {
                console.error("Error fetch artikel kegiatan:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    return (
        <section className="relative pt-10 pb-20 bg-white dark:bg-darkmode">
            {/* Ornamen Kiri */}
            <div
                className="hidden md:block absolute top-0 left-0 h-full w-[48px] bg-repeat-y z-0"
                style={{
                    backgroundImage: "url('/images/hero/batik.png')",
                    backgroundSize: "contain",
                }}
            ></div>

            {/* Ornamen Kanan */}
            <div
                className="hidden md:block absolute top-0 right-0 h-full w-[48px] bg-repeat-y z-0"
                style={{
                    backgroundImage: "url('/images/hero/batik.png')",
                    backgroundSize: "contain",
                }}
            ></div>

            <div className="relative container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
                <div className="flex items-center justify-between flex-wrap mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-midnight_text dark:text-white">
                        Kegiatan Terbaru
                    </h2>
                    <Link
                        href="/kegiatan"
                        className="flex items-center gap-2 text-base font-medium text-midnight_text dark:text-white hover:text-primary dark:hover:text-primary"
                    >
                        Lihat Semua Kegiatan
                        <Icon icon="solar:arrow-right-outline" width={22} height={22} />
                    </Link>
                </div>

                <div className="grid grid-cols-12 gap-6">
                    {loading ? (
                        <p className="col-span-12 text-center text-gray-400 dark:text-gray-500">Memuat kegiatan...</p>
                    ) : (
                        posts.slice(0, 3).map((kegiatan, i) => (
                            <div key={i} className="col-span-12 sm:col-span-6 md:col-span-4">
                                <KegiatanCard kegiatan={kegiatan} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default KegiatanPreview;
