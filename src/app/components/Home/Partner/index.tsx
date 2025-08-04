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
        </section>
    );
};

export default Partners;
