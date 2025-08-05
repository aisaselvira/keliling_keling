"use client";

import {useEffect, useRef, useState} from "react";
import MaxDiv from "./MaxDiv";
import kelingData from "@/app/constant/kelinganData";

const KelingMap = () => {
    const [selectedDesa, setSelectedDesa] = useState<string | null>(null);
    const objectRef = useRef<HTMLObjectElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const svgDoc = objectRef.current?.contentDocument;
            if (!svgDoc) return;

            const isReady = kelingData.desaList.every((desa) => svgDoc.getElementById(desa));
            if (!isReady) return;

            clearInterval(interval);

            kelingData.desaList.forEach((desa) => {
                const el = svgDoc.getElementById(desa);
                if (el) {
                    const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
                    title.textContent = desa;
                    el.appendChild(title);

                    el.style.cursor = "pointer";
                    el.style.transition = "all 0.3s ease";
                    el.style.transformOrigin = "center";
                    el.style.transformBox = "fill-box";

                    el.addEventListener("mouseenter", () => {
                        el.style.transform = "scale(1.05)";
                        el.style.filter = "drop-shadow(0 0 6px rgba(34,197,94,0.6))";
                    });

                    el.addEventListener("mouseleave", () => {
                        el.style.transform = "scale(1)";
                        el.style.filter = "none";
                    });

                    el.addEventListener("click", () => {
                        setSelectedDesa(desa);
                    });
                }
            });
        }, 300);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative py-12 dark:bg-darkmode bg-white">
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
            <div className="relative max-w-6xl mx-auto px-4 z-10">
                <h1 className="font-semibold md:text-6xl sm:text-40 text-3xl text-black dark:text-white text-center mb-10">
                    Kenali 12 Desa di Kecamatan Keling
                </h1>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Left: SVG Map */}
                    <div className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-xl bg-white dark:bg-darklight transition-all duration-500">
                        {/* Tooltip info */}
                        <div className="text-lg mt-3 px-4 py-2 bg-blue-100 dark:bg-gray-800 text-blue-900 dark:text-white rounded-md animate-pulse text-center">
                            💡 Klik pada peta untuk berinteraksi 🖱️
                        </div>
                        <object
                            ref={objectRef}
                            data="/images/maps/peta-keling.svg"
                            type="image/svg+xml"
                            className="w-full h-[600px]"
                            style={{backgroundColor: "transparent"}}
                        />
                    </div>

                    {/* Right: Info Card - centered vertically */}
                    <div className="w-full md:w-1/2 flex items-center justify-center align-middle h-[700px]">
                        <div className="self-center w-full">
                            <MaxDiv
                                desa={selectedDesa}
                                description={selectedDesa ? kelingData.desaInfo[selectedDesa] : null}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default KelingMap;
