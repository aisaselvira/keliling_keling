"use client";
import Image from "next/image";
import {Icon} from "@iconify/react";
import Link from "next/link";
import {useRef, useState, useEffect} from "react";
import {motion, useInView} from "framer-motion";

const Features = () => {
    const ref = useRef(null);
    const inView = useInView(ref);
    const [activeImage, setActiveImage] = useState(0);

    const images = [
        "/images/profile-desa/keling.png",
        "/images/pariwisata/puncak-distoroto.jpg",
        "/images/profile-desa/foto-1.JPG",
        "/images/profile-desa/foto-2.JPG",
        "/images/profile-desa/foto-3.JPG",
        "/images/profile-desa/foto-4.JPG",
        "/images/profile-desa/foto-5.JPG",
    ];

    const fadeFromLeft = {
        animate: inView ? {x: 0, opacity: 1} : {x: "-10%", opacity: 0},
        transition: {duration: 1, delay: 0.5},
    };

    const fadeFromRight = {
        animate: inView ? {x: 0, opacity: 1} : {x: "10%", opacity: 0},
        transition: {duration: 1, delay: 0.5},
    };

    // Ganti gambar setiap 1 detik
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveImage((prev) => (prev + 1) % images.length);
        }, 3000); // 1000ms = 1 detik
        return () => clearInterval(interval);
    }, [images.length]);

    const handlePrev = () => {
        setActiveImage((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleNext = () => {
        setActiveImage((prev) => (prev + 1) % images.length);
    };

    const listItems = [
        {
            icon: "mdi:map-marker-radius-outline",
            text: (
                <>
                    <span className="font-semibold text-black dark:text-white">Kecamatan Keling</span> berada di timur
                    Jepara, berbatasan dengan
                    <span className="font-semibold text-black dark:text-white"> Pati, Kembang, Laut Jawa,</span> dan
                    <span className="font-semibold text-black dark:text-white"> Gunung Muria</span>. Terdiri dari{" "}
                    <span className="font-semibold text-orange-500">12 desa, 66 RW,</span> dan{" "}
                    <span className="font-semibold text-orange-500">316 RT</span>.
                </>
            ),
        },
        {
            icon: "fluent:beach-28-regular",
            text: (
                <>
                    Wisata unggulan seperti{" "}
                    <span className="font-semibold text-black dark:text-white">
                        Pantai Beringin, Candi Angin, Goa Blorong
                    </span>
                    , hingga
                    <span className="font-semibold text-black dark:text-white"> Air Terjun di Damarwulan</span> siap
                    memikat wisatawan.
                </>
            ),
        },
        {
            icon: "mdi:coffee-outline",
            text: (
                <>
                    Komoditas kopi ekspor:{" "}
                    <span className="font-semibold text-black dark:text-white">Kopi Tempur, Kopi Damarwulan,</span> dan{" "}
                    <span className="font-semibold text-black dark:text-white">Kopi Dapur Kuwat</span> dikenal luas
                    hingga hotel dan pasar internasional.
                </>
            ),
        },
        {
            icon: "mdi:hospital-building",
            text: (
                <>
                    Fasilitas kesehatan seperti{" "}
                    <span className="font-semibold text-black dark:text-white">RSUD Kelet</span> dan dua puskesmas,
                    serta aktivitas ekonomi masyarakat di
                    <span className="font-semibold text-black dark:text-white"> Pasar Keling, Kelet,</span> dan{" "}
                    <span className="font-semibold text-black dark:text-white">Pasar Hewan</span>.
                </>
            ),
        },
    ];

    return (
        <section className="bg-grey dark:bg-darklight overflow-x-hidden py-20">
            <div ref={ref} className="container mx-auto lg:max-w-6xl md:max-w-screen-md px-4">
                <div className="grid grid-cols-12 xl:gap-24 gap-6 items-center">
                    {/* Image Slider */}
                    <div className="lg:col-span-6 col-span-12 px-3 relative">
                        <motion.div {...fadeFromLeft} animate={inView ? "animate" : ""}>
                            <div className="relative">
                                {/* Image */}
                                <motion.div
                                    key={activeImage}
                                    initial={{opacity: 0, x: 50}}
                                    animate={{opacity: 1, x: 0}}
                                    transition={{duration: 0.5}}
                                >
                                    <Image
                                        src={images[activeImage]}
                                        alt="profile keling"
                                        width={550}
                                        height={450}
                                        className="w-full h-[400px] object-cover rounded-2xl shadow-xl"
                                    />
                                </motion.div>

                                {/* Arrow Controls */}
                                <button
                                    onClick={handlePrev}
                                    className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white dark:bg-black/60 text-black dark:text-white p-2 rounded-full shadow hover:bg-gray-200 z-10"
                                >
                                    <Icon icon="mdi:chevron-left" width={24} height={24} />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white dark:bg-black/60 text-black dark:text-white p-2 rounded-full shadow hover:bg-gray-200 z-10"
                                >
                                    <Icon icon="mdi:chevron-right" width={24} height={24} />
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Text Info */}
                    <div className="lg:col-span-6 col-span-12 px-3">
                        <motion.div {...fadeFromRight}>
                            <p className="dark:text-white/50 text-black/50 text-lg pb-5">Jelajahi Pesona Keling</p>
                            <h3 className="md:text-5xl text-3xl font-bold text-dark dark:text-white pb-8">
                                Profil Keling, Jepara
                            </h3>

                            <ul className="space-y-6">
                                {listItems.map((item, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{opacity: 0, x: 20}}
                                        whileInView={{opacity: 1, x: 0}}
                                        transition={{delay: 0.3 + index * 0.3, duration: 0.6}}
                                        viewport={{once: true}}
                                        className="flex gap-4 items-start"
                                    >
                                        <Icon
                                            icon={item.icon}
                                            width="28"
                                            height="28"
                                            className="text-primary mt-1 flex-shrink-0"
                                        />
                                        <p className="text-lg text-black/70 dark:text-white/70 leading-relaxed">
                                            {item.text}
                                        </p>
                                    </motion.li>
                                ))}
                            </ul>

                            <div className="mt-10">
                                <Link
                                    href="/umkm"
                                    className="py-2 px-6 bg-primary rounded-xl hover:bg-orange-600 transition-all duration-300 text-white font-semibold shadow-lg"
                                >
                                    Lihat Selengkapnya
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
