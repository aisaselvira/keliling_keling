// Versi slider image UMKM pada ServiceDetail seperti fitur slider custom
"use client";

import React, {useEffect, useState, useRef} from "react";
import {useParams} from "next/navigation";
import Image from "next/image";
import {Icon} from "@iconify/react";
import HeroSub from "@/app/components/SharedComponent/HeroSub";
import ServiceDetailSkeleton from "../Skeleton/ServiceDetail/page";

const fetchBusinessDetail = async (id: string) => {
    try {
        const res = await fetch(`https://keliling-keling-backend-98321.vercel.app/api/umkm/${id}`);
        if (!res.ok) throw new Error("Failed to fetch UMKM detail");
        return await res.json();
    } catch (err) {
        console.error(err);
        return null;
    }
};

const ServiceDetail = () => {
    const {slug} = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const imageIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (slug) {
            fetchBusinessDetail(slug.toString()).then((result) => {
                setData(result);
                setLoading(false);
            });
        }
    }, [slug]);

    useEffect(() => {
        if (data?.photos?.length > 1) {
            imageIntervalRef.current = setInterval(() => {
                setActiveImage((prev) => (prev + 1) % data.photos.length);
            }, 6000);
        }

        return () => {
            if (imageIntervalRef.current) clearInterval(imageIntervalRef.current);
        };
    }, [data?.photos]);

    const handlePrev = () => {
        setActiveImage((prev) => (prev - 1 + data.photos.length) % data.photos.length);
    };

    const handleNext = () => {
        setActiveImage((prev) => (prev + 1) % data.photos.length);
    };

    const breadcrumbLinks = [
        {href: "/", text: "Home"},
        {href: "/umkm", text: "UMKM"},
        {href: `/umkm/${slug}`, text: data?.business_name},
    ];

    if (loading || !data) return <ServiceDetailSkeleton />;

    const {
        business_name,
        description,
        photos = [],
        owner,
        category_name,
        price,
        link,
        village_name,
        location_name,
        address,
        business_telephone,
    } = data;

    const actualLink = link || "https://shopee.co.id/";
    const whatsappLink = business_telephone
        ? `https://api.whatsapp.com/send?phone=${business_telephone}`
        : "https://api.whatsapp.com/";

    return (
        <>
            <HeroSub
                title={business_name}
                description="Informasi lengkap mengenai produk UMKM unggulan dari Kecamatan Keling."
                breadcrumbLinks={breadcrumbLinks}
            />

            <section className="dark:bg-darkmode bg-white py-12">
                <div className="container mx-auto lg:max-w-5xl px-4">
                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Slider Image */}
                        <div className="lg:w-1/2 relative">
                            {photos.length > 0 && (
                                <div className="relative">
                                    <Image
                                        src={photos[activeImage]}
                                        alt={`Photo ${activeImage + 1}`}
                                        width={800}
                                        height={500}
                                        className="w-full h-[400px] object-cover rounded-xl shadow-xl"
                                    />
                                    {photos.length > 1 && (
                                        <>
                                            <button
                                                onClick={handlePrev}
                                                className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white/80 dark:bg-black/60 text-black dark:text-white p-2 rounded-full shadow hover:bg-gray-200 z-10"
                                            >
                                                <Icon icon="mdi:chevron-left" width={24} height={24} />
                                            </button>
                                            <button
                                                onClick={handleNext}
                                                className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white/80 dark:bg-black/60 text-black dark:text-white p-2 rounded-full shadow hover:bg-gray-200 z-10"
                                            >
                                                <Icon icon="mdi:chevron-right" width={24} height={24} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Konten Deskripsi */}
                        <div className="lg:w-1/2 flex flex-col justify-center">
                            <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
                                {owner && (
                                    <span className="bg-gradient-to-r from-sky-300 to-sky-600 text-white px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
                                        <Icon icon="mdi:account" className="text-base" />
                                        {owner}
                                    </span>
                                )}
                                {category_name && (
                                    <span className="bg-gradient-to-r from-green-300 to-green-500 text-white px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
                                        <Icon icon="mdi:tag-outline" className="text-base" />
                                        {category_name}
                                    </span>
                                )}
                                {village_name && (
                                    <span className="bg-gradient-to-r from-purple-300 to-purple-500 text-white px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
                                        <Icon icon="mdi:map-marker" className="text-base" />
                                        {village_name}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">{business_name}</h1>

                            <ul className="text-base text-gray-700 dark:text-gray-300 mb-6 space-y-2">
                                {price && (
                                    <li>
                                        <strong>Harga:</strong> {price}
                                    </li>
                                )}
                                {location_name && (
                                    <li>
                                        <strong>Lokasi:</strong> {location_name}
                                    </li>
                                )}
                                {address && (
                                    <li>
                                        <strong>Alamat:</strong> {address}
                                    </li>
                                )}
                            </ul>

                            <div
                                className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-6"
                                dangerouslySetInnerHTML={{__html: description}}
                            />

                            <div className="flex flex-wrap gap-3">
                                <a
                                    href={actualLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f1582c] text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition-all duration-300"
                                >
                                    <Icon icon="simple-icons:shopee" className="text-xl" />
                                    Beli di Shopee
                                </a>

                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-all duration-300"
                                >
                                    <Icon icon="ic:baseline-whatsapp" className="text-xl" />
                                    Hubungi via WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ServiceDetail;
