"use client";

import HeroSub from "@/app/components/SharedComponent/HeroSub";
import React, {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {FaMapMarkerAlt} from "react-icons/fa";
import {Tab} from "@headlessui/react";

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

    const [villages, setVillages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVillages = async () => {
            try {
                const res = await fetch("https://keliling-keling-backend-98321.vercel.app/api/village");
                const data = await res.json();
                setVillages(data);
            } catch (error) {
                console.error("Gagal mengambil data desa", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVillages();
    }, []);

    return (
        <>
            <HeroSub
                title="Profil Kecamatan Keling"
                description="Mengenal lebih dekat Kecamatan Keling: lokasi, data administratif, dan potensi desanya."
                breadcrumbLinks={breadcrumbLinks}
            />

            <section className="bg-white dark:bg-darkmode py-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-extrabold text-midnight_text dark:text-white mb-4">
                            Informasi Umum Kecamatan Keling
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
                            Kecamatan Keling adalah bagian dari Kabupaten Jepara, Provinsi Jawa Tengah, Indonesia.
                            Memiliki beragam potensi desa, budaya, dan bentang alam yang unik.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {label: "Negara", value: "Indonesia"},
                            {label: "Provinsi", value: "Jawa Tengah"},
                            {label: "Kabupaten", value: "Jepara"},
                            {label: "Jumlah Desa", value: "12 Desa"},
                            {label: "Kode BPS", value: "3320110"},
                            {label: "Kode Kemendagri", value: "33.20.09"},
                            {label: "Luas Wilayah", value: "123,12 Km²"},
                            {label: "Populasi", value: "- jiwa"},
                            {label: "Kepadatan", value: "- jiwa/km²"},
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="p-6 rounded-xl shadow hover:shadow-lg transition-all bg-gradient-to-br from-indigo-100 via-white to-blue-50 dark:from-white/10 dark:via-sky-900/30 dark:to-sky-800/40 backdrop-blur-md"
                            >
                                <h4 className="text-sm text-gray-500 dark:text-white/70">{item.label}</h4>
                                <p className="text-2xl font-semibold text-indigo-700 dark:text-white mt-1">
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

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

            {/* TAB DESA */}
            <section className="bg-white dark:bg-darkmode py-10">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-midnight_text dark:text-white">
                            Potensi Desa di Kecamatan Keling
                        </h2>
                        <p className="text-gray-600 dark:text-white/70 mt-2">
                            Eksplorasi informasi lengkap dari desa-desa yang ada di wilayah Keling.
                        </p>
                    </div>

                    {loading ? (
                        <p className="text-center text-gray-500 dark:text-gray-300">Memuat data desa...</p>
                    ) : (
                        <Tab.Group>
                            <Tab.List className="flex flex-wrap gap-2 justify-center mb-6">
                                {villages.map((desa, idx) => (
                                    <Tab
                                        key={idx}
                                        className={({selected}) =>
                                            `px-4 py-2 rounded-full text-sm font-medium transition shadow-md hover:shadow-lg focus:outline-none ${
                                                selected
                                                    ? "bg-orange-600 text-white"
                                                    : "bg-indigo-100 text-orange-700 dark:bg-darklight dark:text-white"
                                            }`
                                        }
                                    >
                                        {desa.village_name.replace("Desa ", "")}
                                    </Tab>
                                ))}
                            </Tab.List>
                            <Tab.Panels>
                                {villages.map((desa, idx) => (
                                    <Tab.Panel
                                        key={idx}
                                        className="rounded-xl bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-darklight dark:via-darkmode dark:to-[#1d1d1d] p-6 shadow-md backdrop-blur-md transition-all"
                                    >
                                        <h3 className="text-2xl font-bold text-midnight_text dark:text-white mb-3">
                                            {desa.village_name}
                                        </h3>
                                        <p className="text-gray-600 dark:text-white/80 mb-4">
                                            {desa.description || "Informasi belum diisi."}
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3 text-sm">
                                            <div className="bg-white/50 dark:bg-white/10 rounded-lg p-3">
                                                <strong className="text-gray-800 dark:text-white">Alamat:</strong>{" "}
                                                <br />
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    {desa.address || "Belum tersedia"}
                                                </span>
                                            </div>
                                            <div className="bg-white/50 dark:bg-white/10 rounded-lg p-3">
                                                <strong className="text-gray-800 dark:text-white">Wilayah:</strong>{" "}
                                                <br />
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    Kec. {desa.district}, Kab. {desa.regency}
                                                </span>
                                            </div>
                                            <div className="bg-white/50 dark:bg-white/10 rounded-lg p-3">
                                                <strong className="text-gray-800 dark:text-white">Provinsi:</strong>{" "}
                                                <br />
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    {desa.province}
                                                </span>
                                            </div>
                                            <div className="bg-white/50 dark:bg-white/10 rounded-lg p-3">
                                                <strong className="text-gray-800 dark:text-white">Kode Pos:</strong>{" "}
                                                <br />
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    {desa.postal_code}
                                                </span>
                                            </div>
                                        </div>
                                    </Tab.Panel>
                                ))}
                            </Tab.Panels>
                        </Tab.Group>
                    )}
                </div>
            </section>
        </>
    );
};

export default page;
