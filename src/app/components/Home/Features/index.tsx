"use client";

import Image from "next/image";
import {Icon} from "@iconify/react";
import Link from "next/link";
import {useRef, useState, useEffect} from "react";
import {motion, useInView} from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Features = () => {
    const ref = useRef(null);
    const inView = useInView(ref);
    const [activeImage, setActiveImage] = useState(0);
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const partners = [
        {image: "/images/desa-keling/BUMIHARJO.svg"},
        {image: "/images/desa-keling/KELING.svg"},
        {image: "/images/desa-keling/KALIGARANG.svg"},
        {image: "/images/desa-keling/JLEGONG.svg"},
        {image: "/images/desa-keling/GELANG.svg"},
        {image: "/images/desa-keling/TUNAHAN.svg"},
        {image: "/images/desa-keling/KUNIR.svg"},
        {image: "/images/desa-keling/DAMARWULAN.svg"},
        {image: "/images/desa-keling/KELET.svg"},
        {image: "/images/desa-keling/KLEPU.svg"},
        {image: "/images/desa-keling/TEMPUR.svg"},
        {image: "/images/desa-keling/WATUAJI.svg"},
    ];


    // Fetch dari API Gallery
    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await fetch("https://keliling-keling-backend-98321.vercel.app/api/gallery/list");
                const data = await res.json();
                const imageUrls = data.images.map((img: {url: string}) => img.url);
                setImages(imageUrls);
            } catch (error) {
                console.error("Gagal memuat gambar:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGallery();
    }, []);

    // Auto play slider
    useEffect(() => {
        if (!images.length) return;
        const interval = setInterval(() => {
            setActiveImage((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images]);

    const handlePrev = () => {
        setActiveImage((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleNext = () => {
        setActiveImage((prev) => (prev + 1) % images.length);
    };

    const fadeFromLeft = {
        animate: inView ? {x: 0, opacity: 1} : {x: "-10%", opacity: 0},
        transition: {duration: 1, delay: 0.5},
    };

    const fadeFromRight = {
        animate: inView ? {x: 0, opacity: 1} : {x: "10%", opacity: 0},
        transition: {duration: 1, delay: 0.5},
    };
    const listItems = [
        {
            icon: "mdi:map-marker-radius-outline",
            text: (
                <>
                    <span className="font-semibold text-black dark:text-white">Kecamatan Keling</span> berada di timur
                    Jepara, berbatasan dengan
                    <span className="font-semibold text-black dark:text-white"> Pati, Kembang, Laut Jawa,</span> dan
                    <span className="font-semibold text-black dark:text-white"> Gunung Muria</span>. Terdiri dari
                    <span className="font-semibold text-orange-500"> 12 desa, 66 RW,</span> dan
                    <span className="font-semibold text-orange-500"> 316 RT</span>.
                </>
            ),
        },
        {
            icon: "fluent:beach-28-regular",
            text: (
                <>
                    Wisata unggulan seperti
                    <span className="font-semibold text-black dark:text-white">
                        {" "}
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
                    Komoditas kopi ekspor:
                    <span className="font-semibold text-black dark:text-white"> Kopi Tempur, Kopi Damarwulan,</span> dan
                    <span className="font-semibold text-black dark:text-white"> Kopi Dapur Kuwat</span> dikenal luas
                    hingga hotel dan pasar internasional.
                </>
            ),
        },
        {
            icon: "mdi:hospital-building",
            text: (
                <>
                    Fasilitas kesehatan seperti
                    <span className="font-semibold text-black dark:text-white"> RSUD Kelet</span> dan dua puskesmas,
                    serta aktivitas ekonomi masyarakat di
                    <span className="font-semibold text-black dark:text-white"> Pasar Keling, Kelet,</span> dan
                    <span className="font-semibold text-black dark:text-white"> Pasar Hewan</span>.
                </>
            ),
        },
    ];

    const sliderSettings = {
        dots: false,
        arrows: false,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        speed: 6000,
        autoplaySpeed: 0,
        cssEase: "linear",
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 2,
                },
            },
        ],
    };

    return (
        <>
            <section className="relative bg-grey dark:bg-darklight overflow-x-hidden py-20">
                <div
                    className="hidden md:block absolute top-0 left-0 h-full w-[48px] bg-repeat-y z-0"
                    style={{backgroundImage: "url('/images/hero/batik.png')", backgroundSize: "contain"}}
                />
                <div
                    className="hidden md:block absolute top-0 right-0 h-full w-[48px] bg-repeat-y z-0"
                    style={{backgroundImage: "url('/images/hero/batik.png')", backgroundSize: "contain"}}
                />
                <div className="w-full relative z-1 px-2 py-4">
                    <div className="text-center px-4">
                        <motion.h3
                            initial={{opacity: 0, y: 30}}
                            whileInView={{opacity: 1, y: 0}}
                            transition={{duration: 0.6}}
                            className="md:text-3xl text-2xl font-bold text-dark dark:text-white mb-10"
                        >
                            DESA-DESA YANG TERGABUNG DI KECAMATAN KELING
                        </motion.h3>
                    </div>
                    <motion.div initial={{opacity: 0}} whileInView={{opacity: 1}} transition={{duration: 1}}>
                        <Slider {...sliderSettings} className="w-full">
                            {partners.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex justify-center items-center px-2 transition-transform duration-500 hover:scale-105"
                                >
                                    <Image src={item.image} alt="icon" width={129} height={60} />
                                </div>
                            ))}
                        </Slider>
                    </motion.div>
                </div>
            </section>

            {/* Section Fitur */}
            <section className="relative bg-grey dark:bg-darklight overflow-x-hidden py-20">
                <div
                    className="hidden md:block absolute top-0 left-0 h-full w-[48px] bg-repeat-y z-0"
                    style={{backgroundImage: "url('/images/hero/batik.png')", backgroundSize: "contain"}}
                />
                <div
                    className="hidden md:block absolute top-0 right-0 h-full w-[48px] bg-repeat-y z-0"
                    style={{backgroundImage: "url('/images/hero/batik.png')", backgroundSize: "contain"}}
                />

                <div ref={ref} className="relative z-10 container mx-auto lg:max-w-6xl md:max-w-screen-md px-4">
                    <div className="grid grid-cols-12 xl:gap-24 gap-6 items-center">
                        <div className="lg:col-span-6 col-span-12 px-3 relative">
                            <motion.div {...fadeFromLeft}>
                                <div className="relative">
                                    <motion.div
                                        key={activeImage}
                                        initial={{opacity: 0, x: 50}}
                                        animate={{opacity: 1, x: 0}}
                                        transition={{duration: 0.5}}
                                    >
                                        {!loading && images.length > 0 && (
                                            <Image
                                                src={images[activeImage]}
                                                alt="profile keling"
                                                width={550}
                                                height={450}
                                                className="w-full h-[400px] object-cover rounded-2xl shadow-xl"
                                            />
                                        )}
                                    </motion.div>
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
                                        href="/profil-desa"
                                        className="py-2 px-6 bg-orange-500 rounded-xl hover:bg-orange-600 transition-all duration-300 text-white font-semibold shadow-lg"
                                    >
                                        Lihat Selengkapnya
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Features;
