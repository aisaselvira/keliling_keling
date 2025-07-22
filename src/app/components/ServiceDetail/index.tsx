"use client";
import React from "react";
import {useParams} from "next/navigation";
import Image from "next/image";
import {Icon} from "@iconify/react";
import HeroSub from "@/app/components/SharedComponent/HeroSub";
import ServiceDetailSkeleton from "../Skeleton/ServiceDetail/page";

// Data UMKM Dummy (dengan shopeeUrl)
const services = [
    {
        title: "Kerajinan Anyaman Bu Siti",
        slug: "umkm-anyaman-bu-siti",
        description:
            "Anyaman dari daun pandan yang dibuat oleh UMKM Bu Siti di Desa Damarwulan. Produk meliputi tikar, tas, dan wadah serbaguna. Bahan alami, tahan lama, dan cocok untuk dekorasi rumah.",
        image: "/images/umkm/umkm-2.JPG",
        user_id: "Bu Siti",
        jenis: "Kerajinan Tangan",
        harga: "Rp 25.000 - Rp 150.000",
        shopeeUrl: "https://shopee.co.id/umkmdamarwulan",
    },
    {
        title: "Kopi Robusta Gunung Muria",
        slug: "umkm-kopi-robusta",
        description:
            "Kopi robusta hasil panen dari lereng Gunung Muria oleh kelompok tani Keling. Diproses secara tradisional untuk menjaga cita rasa. Tersedia dalam bentuk bubuk dan biji.",
        image: "/images/umkm/umkm-3.JPG",
        user_id: "Ibu Muhajaroh",
        jenis: "Minuman",
        harga: "Rp 35.000 / 250g",
        shopeeUrl: "https://shopee.co.id/umkmkopikeling",
    },
    {
        title: "Batik Tulis Keling",
        slug: "umkm-batik-keling",
        description:
            "Batik tulis asli Keling dengan motif khas budaya Jepara. Diproduksi dengan teknik pewarnaan alami. Tersedia sebagai kain, baju, dan kemeja.",
        image: "/images/umkm/umkm-4.JPG",
        user_id: "UMKM Batik Keling",
        jenis: "Fashion",
        harga: "Rp 100.000 - Rp 500.000",
        shopeeUrl: "https://shopee.co.id/umkmbatikkeling",
    },
];

const ServiceDetail = () => {
    const {slug} = useParams();
    const item = services.find((item) => item.slug === slug);

    const breadcrumbLinks = [
        {href: "/umkm", text: "UMKM"},
        {href: `/umkm/${slug}`, text: "Detail"},
    ];

    if (!item) return <ServiceDetailSkeleton />;

    return (
        <>
            <HeroSub
                title={item.title}
                description="Informasi lengkap mengenai produk UMKM unggulan dari Kecamatan Keling."
                breadcrumbLinks={breadcrumbLinks}
            />

            <section className="dark:bg-darkmode bg-white py-12">
                <div className="container mx-auto lg:max-w-4xl px-4">
                    {/* Gambar Produk */}
                    <div className="mb-8 overflow-hidden rounded-xl shadow-md">
                        <Image
                            src={item.image}
                            alt={item.title}
                            width={800}
                            height={450}
                            className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                        />
                    </div>

                    {/* Info Produk */}
                    <div className="flex flex-wrap items-center gap-3 text-sm mb-6">
                        <span className="bg-gradient-to-r from-pink-300 to-pink-500 text-white px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
                            <Icon icon="mdi:account" className="text-base" />
                            {item.user_id}
                        </span>

                        {item.jenis && (
                            <span className="bg-gradient-to-r from-green-300 to-green-500 text-white px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
                                <Icon icon="mdi:tag-outline" className="text-base" />
                                {item.jenis}
                            </span>
                        )}

                        {item.harga && (
                            <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 text-white px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
                                <Icon icon="mdi:cash" className="text-base" />
                                {item.harga}
                            </span>
                        )}
                    </div>

                    {/* Judul Produk */}
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-5">{item.title}</h1>

                    {/* Deskripsi Produk */}
                    <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6">{item.description}</p>

                    {/* Tombol Shopee */}
                    {item.shopeeUrl && (
                        <a
                            href={item.shopeeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#f1582c] text-white font-medium rounded-lg shadow-md hover:bg-orange-600 transition-colors duration-300"
                        >
                            <Icon icon="simple-icons:shopee" className="text-xl" />
                            Beli di Shopee
                        </a>
                    )}
                </div>
            </section>
        </>
    );
};

export default ServiceDetail;
