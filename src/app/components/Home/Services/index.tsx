"use client";

import Link from "next/link";
import {motion, useInView} from "framer-motion";
import {useRef} from "react";
import SingleService from "./SingleService";

const Services = () => {
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
                "Kopi robusta hasil panen dari lereng Gunung Muria oleh kelompok tani Keling. Diproses secara tradisional untuk menjaga cita rasa. Tersedia dalam bentuk bubuk dan biji kopi.",
            image: "/images/umkm/umkm-3.JPG",
            user_id: "Ibu Muhajaroh",
            jenis: "Produk Pertanian",
            harga: "Rp 35.000 - Rp 70.000",
            shopeeUrl: "https://shopee.co.id/umkmdamarwulan",
        },
        {
            title: "Batik Tulis Keling",
            slug: "umkm-batik-keling",
            description:
                "Batik tulis khas Kecamatan Keling dengan motif budaya Jepara. Menggunakan teknik pewarnaan alami. Tersedia sebagai kain, kemeja, dan pakaian jadi.",
            image: "/images/umkm/umkm-3.JPG",
            user_id: "UMKM Batik Keling",
            jenis: "Fashion & Kriya",
            harga: "Rp 100.000 - Rp 500.000",
            shopeeUrl: "https://shopee.co.id/umkmdamarwulan",
        },
    ];

    const ref = useRef(null);
    const inView = useInView(ref);

    const TopAnimation = {
        animate: inView ? {y: 0, opacity: 1} : {y: "-100%", opacity: 0},
        transition: {duration: 1, delay: 0.4},
    };

    return (
        <section className="dark:bg-darkmode bg-[url('/images/plan/price-plan-background-icons.svg')] bg-cover bg-center bg-no-repeat overflow-hidden py-20">
            <div ref={ref} className="container mx-auto lg:max-w-6xl md:max-w-screen-md px-4">
                <motion.div {...TopAnimation} className="mb-16">
                    <p className="text-black/50 dark:text-white/50 text-lg lg:text-start text-center">
                        Jelajahi produk-produk unggulan dari pelaku UMKM di Kecamatan Keling.
                    </p>
                    <div className="flex lg:flex-row flex-col lg:gap-0 gap-10 justify-between items-center mt-5">
                        <h2 className="font-semibold md:text-6xl sm:text-40 text-3xl text-black dark:text-white lg:text-start text-center">
                            UMKM <br /> Kecamatan Keling
                        </h2>
                        <Link
                            href="/umkm"
                            className="py-2 px-4 bg-primary rounded-lg hover:bg-orange-600 duration-300 text-white font-semibold"
                        >
                            Lihat Semua UMKM
                        </Link>
                    </div>
                </motion.div>

                <div className="grid grid-cols-12 gap-6">
                    {services.map((item, index) => (
                        <SingleService key={index} service={item} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
