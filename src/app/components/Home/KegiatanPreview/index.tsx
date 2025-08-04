"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {Icon} from "@iconify/react";
import KegiatanList from "@/app/components/KegiatanList";

const KegiatanPreview = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await fetch("https://keliling-keling-backend-98321.vercel.app/api/article");
                if (!res.ok) throw new Error("Gagal mengambil data kegiatan");
                const data = await res.json();

                const postWithSlug = data
                .map((item: any) => ({
                    ...item,
                    slug: item.article_id.toString(),
                }))
                .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // 🔥 Sort by date DESC

                setPosts(postWithSlug);
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
                style={{backgroundImage: "url('/images/hero/batik.png')", backgroundSize: "contain"}}
            />
            {/* Ornamen Kanan */}
            <div
                className="hidden md:block absolute top-0 right-0 h-full w-[48px] bg-repeat-y z-0"
                style={{backgroundImage: "url('/images/hero/batik.png')", backgroundSize: "contain"}}
            />

            <div className="relative container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 z-10">
                <div className="flex items-center justify-between flex-wrap mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-midnight_text dark:text-white">
                        Kegiatan Terbaru
                    </h2>
                    <Link
                        href="/kegiatan"
                        className="inline-flex items-center gap-2 bg-primary hover:bg-orange-600 text-white font-semibold text-sm md:text-base py-2.5 px-5 rounded-lg shadow transition-all duration-300"
                    >
                        Lihat Semua Kegiatan
                        <Icon icon="solar:arrow-right-outline" width={22} height={22} />
                    </Link>
                </div>

                <div className="grid grid-cols-12 gap-6">
                    {loading ? (
                        <p className="col-span-12 text-center text-gray-400 dark:text-gray-500">Memuat kegiatan...</p>
                    ) : (
                        posts.slice(0, 6).map((kegiatan, i) => (
                            <div key={i} className="w-full lg:col-span-4 md:col-span-6 col-span-12">
                                <KegiatanList kegiatan={kegiatan} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default KegiatanPreview;
