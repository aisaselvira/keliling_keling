"use client";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {useState, useEffect} from "react";

const Partners = () => {
    const [partners, setpartners] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/data");
                if (!res.ok) throw new Error("Failed to fetch");

                const data = await res.json();
                setpartners(data.partners || []);
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };

        fetchData();
    }, []);
    const settings = {
        dots: false,
        arrows: false,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        speed: 10000,
        autoplaySpeed: 2000,
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
        <section className="bg-blue relative py-10">
            {/* Ornamen Kiri */}
            <div
                className="hidden md:block absolute top-0 left-0 h-full w-[48px] bg-repeat-y z-0"
                style={{
                    backgroundImage: "url('/images/hero/batik.png')",
                    backgroundSize: "contain",
                }}
            ></div>

            {/* Ornamen Kanan */}
            <div
                className="hidden md:block absolute top-0 right-0 h-full w-[48px] bg-repeat-y z-0"
                style={{
                    backgroundImage: "url('/images/hero/batik.png')",
                    backgroundSize: "contain",
                }}
            ></div>
            <div className="container mx-auto lg:max-w-xl md:max-w-screen-md relative z-1 px-4">
                <div className="text-center">
                    <h3 className="text-white dark:text-white text-lg font-mediumc mb-10">
                        Trusted by content creators across the world
                    </h3>
                </div>
                <Slider {...settings}>
                    {partners.map((item, index) => (
                        <div key={index} className="!flex justify-center items-center">
                            <Image src={item.image} alt="icon" width={129} height={32} />
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
};

export default Partners;
