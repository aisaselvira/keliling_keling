"use client";

import Link from "next/link";
import {motion, useInView} from "framer-motion";
import {useEffect, useRef, useState} from "react";
import SingleService from "./SingleService";
import SkeletonCard from "../../Skeleton/ServiceCard/page"; // optional jika ingin loading skeleton

const Services = () => {
    const ref = useRef(null);
    const inView = useInView(ref);

    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("https://keliling-keling-backend-98321.vercel.app/api/umkm");
                if (!res.ok) throw new Error("Failed to fetch UMKM");
                const data = await res.json();
                setServices(data);
            } catch (err) {
                console.error("Failed to load UMKM:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const TopAnimation = {
        animate: inView ? {y: 0, opacity: 1} : {y: "-100%", opacity: 0},
        transition: {duration: 1, delay: 0.4},
    };

    return (
        <section className="relative dark:bg-darkmode bg-[url('/images/plan/price-plan-background-icons.svg')] bg-cover bg-center bg-no-repeat overflow-hidden py-20">
            {/* Ornamen Samping */}
            <div
                className="hidden md:block absolute top-0 left-0 h-full w-[48px] bg-repeat-y z-0"
                style={{backgroundImage: "url('/images/hero/batik.png')", backgroundSize: "contain"}}
            />
            <div
                className="hidden md:block absolute top-0 right-0 h-full w-[48px] bg-repeat-y z-0"
                style={{backgroundImage: "url('/images/hero/batik.png')", backgroundSize: "contain"}}
            />

            <div ref={ref} className="relative container mx-auto lg:max-w-6xl md:max-w-screen-md px-4 z-10">
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
                    {loading
                        ? Array.from({length: 3}).map((_, i) => <SkeletonCard key={i} />)
                        : services.map((item, index) => <SingleService key={index} service={item} />)}
                </div>
            </div>
        </section>
    );
};

export default Services;
