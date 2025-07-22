import HeroSub from "@/app/components/SharedComponent/HeroSub";
import React from "react";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Profil Desa | SassCandy",
};

const page = () => {
    const breadcrumbLinks = [
        {href: "/", text: "Home"},
        {href: "/contact", text: "Profil Desa"},
    ];

    const cards = [
        {
            title: "Pertanian",
            description: "Pengembangan pertanian organik dan modern berbasis teknologi.",
            color: "bg-green-100 text-green-900",
        },
        {
            title: "UMKM Kreatif",
            description: "Produk lokal seperti kerajinan dan kuliner khas desa.",
            color: "bg-yellow-100 text-yellow-900",
        },
        {
            title: "Digitalisasi",
            description: "Transformasi digital untuk pelayanan publik yang efisien.",
            color: "bg-blue-100 text-blue-900",
        },
        {
            title: "Pariwisata",
            description: "Wisata alam dan budaya yang menjadi daya tarik tersendiri.",
            color: "bg-pink-100 text-pink-900",
        },
    ];

    return (
        <>
            <HeroSub
                title="Profil Desa"
                description="Mengenal lebih dekat Desa Keling: lokasi, potensi, dan aktivitasnya."
                breadcrumbLinks={breadcrumbLinks}
            />
            <section className="bg-white dark:bg-darkmode py-12">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-midnight_text dark:text-white mb-4">
                            Tentang Desa Keling
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-white/70">
                            Desa Keling adalah desa yang kaya akan budaya, sejarah, dan potensi lokal. Terletak di
                            wilayah strategis dengan sumber daya alam dan manusia yang melimpah.
                        </p>
                    </div>

                    {/* Video Profil (YouTube Embed) */}
                    <div className="aspect-video mb-8 rounded-lg overflow-hidden">
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/cVzSBirkKAg?si=cQvdndH4NwNHbRkc"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>
                    </div>

                    {/* Deskripsi Profil Desa */}
                    <div className="text-gray-700 dark:text-white/80 leading-relaxed space-y-4 mb-10">
                        <p>
                            Dengan penduduk yang ramah dan gotong royong yang kuat, Desa Keling terus berkembang menjadi
                            desa mandiri yang berdaya saing tinggi. Berbagai program pembangunan dan pemberdayaan
                            masyarakat aktif dijalankan, mulai dari pertanian, UMKM, hingga digitalisasi.
                        </p>
                        <p>
                            Saksikan video profil kami untuk mengetahui lebih lanjut tentang kehidupan dan semangat
                            warga Desa Keling.
                        </p>
                    </div>

                    {/* Kotak-kotak Warna Warni */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {cards.map((card, index) => (
                            <div
                                key={index}
                                className={`rounded-xl shadow-md p-6 transition-transform hover:scale-105 ${card.color}`}
                            >
                                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                                <p className="text-sm">{card.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default page;
