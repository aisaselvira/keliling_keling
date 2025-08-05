"use client";

import {useEffect, useState, useRef} from "react";
import {useParams} from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import HeroSub from "@/app/components/SharedComponent/HeroSub";
import {Icon} from "@iconify/react";

const fetchTourismDetail = async (id: string) => {
    try {
        const res = await fetch(`https://keliling-keling-backend-98321.vercel.app/api/tourism/${id}`);
        if (!res.ok) throw new Error("Failed to fetch tourism detail");
        return await res.json();
    } catch (err) {
        console.error(err);
        return null;
    }
};

const getEmbedMapUrl = (mapsUrl?: string): string => {
    if (!mapsUrl) {
        return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63355.21731073019!2d110.6298454!3d-6.5781365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e710064dc62c313%3A0xfebbe3eb76e38e6e!2sKeling%2C%20Kabupaten%20Jepara%2C%20Jawa%20Tengah!5e0!3m2!1sid!2sid!4v1691149950000!5m2!1sid!2sid";
    }
    const match = mapsUrl.match(/\/maps\\.app\\.goo\\.gl\/(.*)/);
    if (match) {
        return `https://www.google.com/maps/embed?q=${encodeURIComponent(mapsUrl)}`;
    }
    return mapsUrl.replace("/maps", "/maps/embed");
};

export default function Page() {
    const {slug} = useParams();
    const [tourism, setTourism] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const imageIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (slug) {
            fetchTourismDetail(slug.toString()).then((data) => {
                setTourism(data);
                setLoading(false);
            });
        }
    }, [slug]);

    useEffect(() => {
        if (tourism?.photos?.length > 1) {
            imageIntervalRef.current = setInterval(() => {
                setActiveImage((prev) => (prev + 1) % tourism.photos.length);
            }, 6000);
        }
        return () => {
            if (imageIntervalRef.current) clearInterval(imageIntervalRef.current);
        };
    }, [tourism?.photos]);

    if (loading || !tourism) return <div>Loading...</div>;

    const ticket = parseInt(tourism.ticket_fee) === 0 ? "Gratis" : `Rp${tourism.ticket_fee}`;
    const embedMapLink = getEmbedMapUrl(tourism.link);

    const breadcrumbLinks = [
        {href: "/", text: "Home"},
        {href: "/pariwisata", text: "Pariwisata"},
        {href: `/pariwisata/${slug}`, text: tourism.tourism_name},
    ];

    return (
        <>
            <HeroSub
                title="Pariwisata"
                description="Temukan keindahan alam dan budaya di setiap sudut Kecamatan Keling."
                breadcrumbLinks={breadcrumbLinks}
            />

            <section className="relative dark:bg-darkmode bg-white pt-10 pb-8">
                <div className="container lg:max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl font-bold text-midnight_text dark:text-white mb-4">
                        {tourism.tourism_name}
                    </h1>

                    <div className="flex flex-wrap gap-2 mb-6">
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                            🏘️ {tourism.village_name}
                        </span>
                        <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                            📍 {tourism.address || "Alamat tidak tersedia"}
                        </span>
                        <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                            🎟️ {ticket}
                        </span>
                    </div>

                    {/* Slider */}
                    {tourism.photos?.length > 0 && (
                        <div className="relative mb-6">
                            <Image
                                src={tourism.photos[activeImage]}
                                alt={`photo-${activeImage}`}
                                width={1170}
                                height={400}
                                className="w-full h-[400px] object-cover rounded-xl shadow-xl"
                            />
                            {tourism.photos.length > 1 && (
                                <>
                                    <button
                                        onClick={() =>
                                            setActiveImage(
                                                (prev) => (prev - 1 + tourism.photos.length) % tourism.photos.length
                                            )
                                        }
                                        className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white/80 dark:bg-black/60 text-black dark:text-white p-2 rounded-full shadow hover:bg-gray-200 z-10"
                                    >
                                        <Icon icon="mdi:chevron-left" width={24} height={24} />
                                    </button>
                                    <button
                                        onClick={() => setActiveImage((prev) => (prev + 1) % tourism.photos.length)}
                                        className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white/80 dark:bg-black/60 text-black dark:text-white p-2 rounded-full shadow hover:bg-gray-200 z-10"
                                    >
                                        <Icon icon="mdi:chevron-right" width={24} height={24} />
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    <ul className="space-y-3 mb-8">
                        <li className="flex items-start gap-3">
                            <Icon icon="mdi:map-marker-outline" className="text-primary mt-1" width={22} />
                            <span className="text-black/70 dark:text-white/70 text-lg">
                                Alamat: {tourism.address || "Tidak tersedia"}
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Icon icon="mdi:chair-school" className="text-primary mt-1" width={22} />
                            <span className="text-black/70 dark:text-white/70 text-lg">
                                Fasilitas: {tourism.facility || "Tidak tersedia"}
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Icon icon="mdi:ticket-percent" className="text-primary mt-1" width={22} />
                            <span className="text-black/70 dark:text-white/70 text-lg">Harga Tiket: {ticket}</span>
                        </li>
                    </ul>

                    <div className="prose dark:prose-invert max-w-none mb-10">
                        <h2>Deskripsi</h2>
                        <p>{tourism.description || "Belum ada deskripsi."}</p>
                    </div>

                    <h2 className="text-xl font-semibold text-dark dark:text-white mb-2">Peta Lokasi</h2>
                    <div className="w-full h-[400px] mb-8 rounded-xl overflow-hidden shadow-lg">
                        <iframe
                            src={embedMapLink}
                            className="w-full h-full border-0"
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </section>
        </>
    );
}
