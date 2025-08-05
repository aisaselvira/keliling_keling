"use client";

import React, {useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {motion} from "framer-motion";
import HeroSub from "@/app/components/SharedComponent/HeroSub";
import {FaSearch, FaExclamationCircle} from "react-icons/fa";

const desaList = [
    "Bumiharjo",
    "Damarwulan",
    "Tempur",
    "Gelang",
    "Jlegong",
    "Kaligarang",
    "Kelet",
    "Keling",
    "Klepu",
    "Kunir",
    "Tunahan",
    "Watuaji",
];

const TourismPage = () => {
    const [data, setData] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedDesa, setSelectedDesa] = useState("");

    useEffect(() => {
        const fetchTourism = async () => {
            try {
                const res = await fetch("https://keliling-keling-backend-98321.vercel.app/api/tourism");
                const result = await res.json();
                setData(result);
                setFiltered(result);
            } catch (error) {
                console.error("Gagal mengambil data pariwisata", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTourism();
    }, []);

    const handleFilter = (desa: string = selectedDesa, keyword: string = searchKeyword) => {
        setSelectedDesa(desa);
        const result = data.filter((item) => {
            const matchDesa = desa === "" || item.village_name === desa || item.village_name === `Desa ${desa}`;
            const matchKeyword = item.tourism_name.toLowerCase().includes(keyword.toLowerCase());
            return matchDesa && matchKeyword;
        });
        setFiltered(result);
    };

    const handleSearch = (keyword: string) => {
        setSearchKeyword(keyword);
        handleFilter(selectedDesa, keyword);
    };

    const breadcrumbLinks = [
        {href: "/", text: "Home"},
        {href: "/pariwisata", text: "Pariwisata"},
    ];

    return (
        <>
            <HeroSub
                title="Pariwisata"
                description="Temukan keindahan alam dan budaya di setiap sudut Kecamatan Keling."
                breadcrumbLinks={breadcrumbLinks}
            />

            <section className="flex flex-wrap justify-center dark:bg-darkmode pt-10">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-midnight_text dark:text-white mb-8 text-center">
                        Destinasi Wisata di Keling
                    </h2>

                    {/* Filter */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 mb-10 w-full px-4 max-w-6xl mx-auto">
                        {/* Search */}
                        <div className="relative w-full sm:w-[32rem]">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari nama pariwisata..."
                                className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkmode text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchKeyword}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>

                        {/* Dropdown Desa */}
                        <select
                            className="px-4 py-2 w-full sm:w-[24rem] rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkmode text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedDesa}
                            onChange={(e) => handleFilter(e.target.value)}
                        >
                            <option value="">Semua Desa</option>
                            {desaList.map((desa) => (
                                <option key={desa} value={desa}>
                                    {desa}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Grid Pariwisata */}
                    <div className="grid grid-cols-12 lg:px-4 px-0 gap-7">
                        {loading ? (
                            Array.from({length: 6}).map((_, i) => (
                                <div key={i} className="col-span-12 sm:col-span-6 lg:col-span-4 animate-pulse">
                                    <div className="w-full h-52 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                </div>
                            ))
                        ) : filtered.length === 0 ? (
                            <div className="col-span-12 flex flex-col items-center justify-center py-20 text-center">
                                <FaExclamationCircle className="text-4xl text-gray-400 mb-2" />
                                <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                                    Pariwisata tidak ditemukan.
                                </p>
                            </div>
                        ) : (
                            filtered.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{scale: 1.03}}
                                    className="col-span-12 sm:col-span-6 lg:col-span-4"
                                >
                                    <Link href={`/pariwisata/${item.tourism_id}`}>
                                        <div className="rounded-xl overflow-hidden shadow hover:shadow-lg transition-all bg-white dark:bg-darklight">
                                            <Image
                                                src={item.photos[0] || "/images/placeholder.jpg"}
                                                alt={item.tourism_name}
                                                width={400}
                                                height={260}
                                                className="w-full h-52 object-cover"
                                            />
                                            <div className="p-5">
                                                <h3 className="text-xl font-bold text-midnight_text dark:text-white mb-2">
                                                    {item.tourism_name}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                                                    {item.description || "Tidak ada deskripsi."}
                                                </p>
                                                <p className="mt-2 text-sm text-primary">
                                                    📍 {item.village_name || "Desa tidak tersedia"}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default TourismPage;
