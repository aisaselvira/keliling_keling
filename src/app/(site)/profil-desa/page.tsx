"use client";

import HeroSub from "@/app/components/SharedComponent/HeroSub";
import React, {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {FaMapMarkerAlt} from "react-icons/fa";

const page = () => {
    const breadcrumbLinks = [
        {href: "/", text: "Home"},
        {href: "/contact", text: "Profil Desa"},
    ];

    const cards = [
        {
            title: "Pertanian",
            description: "Pengembangan pertanian organik dan modern berbasis teknologi.",
            color: "bg-green-100 text-green-900",
        },
        {
            title: "UMKM Kreatif",
            description: "Produk lokal seperti kerajinan dan kuliner khas desa.",
            color: "bg-yellow-100 text-yellow-900",
        },
        {
            title: "Digitalisasi",
            description: "Transformasi digital untuk pelayanan publik yang efisien.",
            color: "bg-blue-100 text-blue-900",
        },
        {
            title: "Pariwisata",
            description: "Wisata alam dan budaya yang menjadi daya tarik tersendiri.",
            color: "bg-pink-100 text-pink-900",
        },
    ];

    const [villages, setVillages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVillages = async () => {
            try {
                const res = await fetch("https://keliling-keling-backend-98321.vercel.app/api/village");
                const data = await res.json();
                setVillages(data);
            } catch (error) {
                console.error("Gagal mengambil data desa", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVillages();
    }, []);

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

                    <div className="aspect-video mb-8 rounded-lg overflow-hidden">
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/cVzSBirkKAg?si=cQvdndH4NwNHbRkc"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>
                    </div>

                    <div className="text-gray-700 dark:text-white/80 leading-relaxed space-y-4 mb-10">
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
                        {cards.map((card, index) => (
                            <div
                                key={index}
                                className={`rounded-xl shadow-md p-6 transition-transform hover:scale-105 ${card.color}`}
                            >
                                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                                <p className="text-sm">{card.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-midnight_text dark:text-white">
                            Potensi Desa di Kecamatan Keling
                        </h2>
                        <p className="text-gray-600 dark:text-white/70 mt-2">
                            Eksplorasi informasi lengkap dari desa-desa yang ada di wilayah Keling.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading
                            ? Array.from({length: 6}).map((_, i) => (
                                  <div key={i} className="rounded-xl bg-gray-200 dark:bg-gray-700 h-56 animate-pulse" />
                              ))
                            : villages.map((desa, i) => {
                                  const bgColors = [
                                      "from-red-300 to-red-100",
                                      "from-blue-300 to-blue-100",
                                      "from-green-300 to-green-100",
                                      "from-yellow-300 to-yellow-100",
                                      "from-purple-300 to-purple-100",
                                      "from-pink-300 to-pink-100",
                                      "from-teal-300 to-teal-100",
                                      "from-orange-300 to-orange-100",
                                  ];
                                  const gradient = bgColors[i % bgColors.length];

                                  return (
                                      <motion.div
                                          key={i}
                                          initial={{opacity: 0, y: 30}}
                                          whileInView={{opacity: 1, y: 0}}
                                          transition={{duration: 0.4, delay: i * 0.05}}
                                          viewport={{once: true}}
                                      >
                                          <div
                                              className={`rounded-xl bg-gradient-to-br ${gradient} text-gray-800 dark:text-white p-6 shadow-lg backdrop-blur-md transition-all duration-500 ease-in-out transform hover:scale-[1.05] hover:rotate-[3deg] hover:shadow-2xl`}
                                              style={{perspective: "1000px", transformStyle: "preserve-3d"}}
                                          >
                                              <h3 className="text-xl font-bold mb-2">{desa.village_name}</h3>
                                              <p className="text-sm mb-3 line-clamp-3">{desa.description}</p>
                                              <div className="flex items-start gap-2 text-sm">
                                                  <FaMapMarkerAlt className="mt-1" />
                                                  <span>
                                                      {desa.address || `Kec. ${desa.district}, Kab. ${desa.regency}`}
                                                      <br />
                                                      <span className="text-xs text-gray-700">
                                                          Provinsi {desa.province}, Kode Pos: {desa.postal_code}
                                                      </span>
                                                  </span>
                                              </div>
                                          </div>
                                      </motion.div>
                                  );
                              })}
                    </div>
                </div>
            </section>
        </>
    );
};

export default page;
