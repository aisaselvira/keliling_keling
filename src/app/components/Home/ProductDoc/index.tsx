"use client";

import Link from "next/link";
import {Icon} from "@iconify/react";
import React, {useState} from "react";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SingleDoc from "./SingleDoc";
import {motion} from "framer-motion";

const ProductDoc = () => {
    const [DocText] = useState([
        {
            icon: "mdi:map-marker-radius",
            title: "Bukit Bejagan, Tempur",
            text: "Bukit Bejagan menawarkan panorama alam pegunungan yang memukau. Tiket masuk hanya Rp5.000 dan parkir Rp2.000. Cocok untuk yang ingin menyatu dengan alam dan ngopi di ketinggian.",
        },
        {
            icon: "mdi:waterfall",
            title: "Air Terjun Kyai Buku, Damarwulan",
            text: "Air Terjun Kyai Buku adalah surga tersembunyi di Desa Damarwulan. Aliran airnya jernih dan suasananya damai. Cocok untuk berenang atau melepas penat dari rutinitas kota.",
        },
        {
            icon: "mdi:image-filter-hdr",
            title: "Keindahan Puncak Distoroto",
            text: "Puncak Distoroto adalah puncak tertinggi di Damarwulan yang menyuguhkan pemandangan indah dan spot foto instagramable. Pendakian menantang, tapi sepadan dengan panorama alam yang memukau.",
        },
    ]);

    const [Beranda] = useState([
        {
            image: "/images/pariwisata/kyai-buku.png",
            title: "Air Terjun Kyai Buku",
        },
        {
            image: "/images/pariwisata/bukit-bejagan.jpg",
            title: "Bukit Bejagan Tempur",
        },
    ]);

    const settings = {
        autoplay: true,
        dots: false,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <section className="bg-blue relative bg-[url(/images/productdoc/portfolio-backoverlay.svg)] bg-center bg-no-repeat bg-contain">
            <div className="container mx-auto lg:max-w-xl md:max-w-screen-md px-4">
                {/* Heading */}
                <div>
                    <p className="text-lg text-primary sm:text-start text-center">Pariwisata Keling</p>
                    <div className="flex sm:flex-row flex-col sm:gap-0 gap-6 justify-between items-center mt-1.875">
                        <h3 className="text-white md:text-6xl sm:text-40 text-3xl font-semibold">
                            Jelajahi Pesona
                            <br />
                            Alam Keling
                        </h3>
                        <Link
                            href="/"
                            className="px-4 py-2 bg-primary rounded-lg text-white text-lg font-semibold hover:bg-orange-600 duration-500"
                        >
                            Lihat Semua Wisata
                        </Link>
                    </div>
                </div>

                {/* Informasi singkat tempat */}
                <div className="grid grid-cols-12 pt-16 gap-x-6 gap-y-8 lg:pb-20 pb-10">
                    {DocText.map((item, index) => (
                        <SingleDoc key={index} icon={item.icon} title={item.title} text={item.text} />
                    ))}
                </div>

                {/* Carousel gambar wisata */}
                <Slider {...settings}>
                    {Beranda.map((item, index) => (
                        <motion.div
                            key={index}
                            className="px-3"
                            initial={{scale: 0.95, opacity: 0}}
                            whileInView={{scale: 1, opacity: 1}}
                            transition={{duration: 0.5, delay: index * 0.2}}
                            viewport={{once: true}}
                        >
                            <motion.div
                                whileHover={{scale: 1.03}}
                                className="w-full h-[500px] relative overflow-hidden rounded-2xl shadow-xl group cursor-pointer"
                            >
                                {/* Gambar */}
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                                    <p className="text-white text-lg md:text-xl font-semibold text-center drop-shadow-lg">
                                        {item.title}
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </Slider>
            </div>
        </section>
    );
};

export default ProductDoc;
