"use client";
import React, {useRef, useState} from "react";
import {motion} from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const Hero: React.FC = () => {
    const ref = useRef(null);

    const leftAnimation = {
        initial: {x: "-25%", opacity: 0},
        animate: {x: 0, opacity: 1},
        transition: {duration: 1, delay: 0.8},
    };
    const rightAnimation = {
        initial: {x: "25%", opacity: 0},
        animate: {x: 0, opacity: 1},
        transition: {duration: 1, delay: 0.8},
    };

    const [isModalOpen, setIsSignInOpen] = useState<boolean>(false);
    const openModal = (): void => setIsSignInOpen(true);
    const closeModal = (): void => setIsSignInOpen(false);

    return (
        <section className="relative overflow-hidden min-h-screen flex items-center justify-center px-4 pt-28 md:pt-36">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                    <source src="/images/hero/damar.MOV" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                {/* Dark overlay to improve text visibility */}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 container mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
                {/* Left Text */}
                <motion.div {...leftAnimation} className="text-center lg:text-left">
                    <h1 className="text-white mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                        JELAJAH KELING
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl font-medium text-white/80 sm:py-4 py-3">
                        Temukan Pesona Alam, Budaya, dan UMKM dalam Satu Layanan Digital Desa.
                    </p>
                    <Link
                        href="/umkm"
                        className="sm:px-4 px-4 sm:py-2 py-2 rounded-lg text-base font-semibold bg-primary text-white hover:bg-orange-600 duration-500 inline-block"
                    >
                        Lihat Selengkapnya
                    </Link>
                </motion.div>

                {/* Right Image */}
                <motion.div {...rightAnimation} className="w-full h-full flex justify-center">
                    <Image
                        src="/images/hero/hero.png"
                        alt="hero Image"
                        width={500}
                        height={500}
                        className="w-full max-w-[400px] sm:max-w-[450px] md:max-w-[500px] object-contain"
                    />
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
