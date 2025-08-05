"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {Icon} from "@iconify/react";
import KegiatanCard from "./kegiatanCard";

type Kegiatan = {
    article_id: number;
    title: string;
    timestamp: string;
    content: string;
    photo: string;
    slug?: string;
};

const Kegiatan: React.FC = () => {
    const [posts, setPosts] = useState<Kegiatan[]>([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch("https://keliling-keling-backend-98321.vercel.app/api/article", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const articles = await response.json();

                const latestPosts = articles.slice(0, 3).map((item: Kegiatan) => ({
                    ...item,
                    slug: item.article_id.toString(), // optional untuk routing
                }));

                setPosts(latestPosts);
            } catch (error) {
                console.error("Failed to fetch articles:", error);
            }
        };

        fetchArticles();
    }, []);

    return (
        <section className="flex flex-wrap justify-center dark:bg-darkmode" id="kegiatan">
            <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
                <div className="flex items-baseline justify-between flex-wrap">
                    <h2 className="sm:mb-11 mb-3 text-4xl font-bold text-midnight_text dark:text-white">
                        Latest blog & news
                    </h2>
                    <Link
                        href="/kegiatan"
                        className="flex items-center gap-3 text-base text-midnight_text dark:text-white hover:dark:text-primary font-medium hover:text-primary sm:pb-0 pb-3"
                    >
                        View More
                        <Icon icon="solar:arrow-right-outline" width="30" height="30" />
                    </Link>
                </div>
                <div className="grid grid-cols-12 gap-7">
                    {posts.map((kegiatan, i) => (
                        <div key={i} className="w-full md:col-span-4 sm:col-span-6 col-span-12">
                            <KegiatanCard kegiatan={kegiatan} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Kegiatan;
