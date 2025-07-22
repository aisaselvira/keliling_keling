import HeroSub from "@/app/components/SharedComponent/HeroSub";
import React from "react";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Profil Desa",
};

const page = () => {
    const breadcrumbLinks = [
        {href: "/", text: "Home"},
        {href: "/profil-desa", text: "Profil Desa"},
    ];

    return (
        <>
            <HeroSub
                title="Profil Desa"
                description="Mengenal lebih dekat Desa Keling: lokasi, potensi, dan aktivitasnya."
                breadcrumbLinks={breadcrumbLinks}
            />
            <section className="bg-white dark:bg-darkmode py-12">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-midnight_text dark:text-white mb-4">
                            Tentang Desa Keling
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-white/70">
                            Desa Keling adalah desa yang kaya akan budaya, sejarah, dan potensi lokal. Terletak di
                            wilayah strategis dengan sumber daya alam dan manusia yang melimpah.
                        </p>
                    </div>

                    <div className="aspect-w-16 aspect-h-9 mb-8">
                        <iframe
                            className="w-full h-full rounded-lg"
                            src="https://youtu.be/cVzSBirkKAg?si=q1VJSKwJI7pewpR5"
                            title="YouTube video profil desa"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>

                    <div className="text-gray-700 dark:text-white/80 leading-relaxed space-y-4">
                        <p>
                            Dengan penduduk yang ramah dan gotong royong yang kuat, Desa Keling terus berkembang menjadi
                            desa mandiri yang berdaya saing tinggi. Berbagai program pembangunan dan pemberdayaan
                            masyarakat aktif dijalankan, mulai dari pertanian, UMKM, hingga digitalisasi.
                        </p>
                        <p>
                            Saksikan video profil kami untuk mengetahui lebih lanjut tentang kehidupan dan semangat
                            warga Desa Keling.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default page;
