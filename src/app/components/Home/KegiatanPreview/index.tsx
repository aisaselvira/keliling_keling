// src/app/components/Home/KegiatanPreview.tsx
import React from "react";
import Link from "next/link";
import {Icon} from "@iconify/react";
import {getAllPosts} from "@/utils/markdown";
import KegiatanCard from "@/app/components/SharedComponent/Kegiatan/kegiatanCard";

const KegiatanPreview = () => {
    const posts = getAllPosts(["title", "date", "excerpt", "coverImage", "slug"]).slice(0, 3);

    return (
        <section className="pt-10 pb-20 bg-white dark:bg-darkmode">
            <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
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
                    {posts.map((kegiatan, i) => (
                        <div key={i} className="col-span-12 sm:col-span-6 md:col-span-4">
                            <KegiatanCard kegiatan={kegiatan} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default KegiatanPreview;
