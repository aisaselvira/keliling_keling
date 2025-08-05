"use client";

import React, {useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {motion} from "framer-motion";
import HeroSub from "@/app/components/SharedComponent/HeroSub";

const TourismPage = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTourism = async () => {
            try {
                const res = await fetch("https://keliling-keling-backend-98321.vercel.app/api/tourism");
                const result = await res.json();
                setData(result);
            } catch (error) {
                console.error("Gagal mengambil data pariwisata", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTourism();
    }, []);

    const breadcrumbLinks = [
        {href: "/", text: "Home"},
        {href: "/pariwisata", text: "Pariwisata"},
    ];

    return (
        <>
            <HeroSub
                title="Pariwisata"
                description="Temukan keindahan alam dan budaya di setiap sudut Kecamatan Keling."
                breadcrumbLinks={breadcrumbLinks}
            />
            <section className="flex flex-wrap justify-center dark:bg-darkmode">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-midnight_text dark:text-white mb-10 text-center">
                        Destinasi Wisata di Keling
                    </h2>
                    <div className="grid grid-cols-12 lg:px-4 px-0 gap-7">
                        {loading
                            ? Array.from({length: 6}).map((_, i) => (
                                  <div key={i} className="col-span-12 sm:col-span-6 lg:col-span-4 animate-pulse">
                                      <div className="w-full h-52 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
                                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                  </div>
                              ))
                            : data.map((item, idx) => (
                                  <motion.div
                                      key={idx}
                                      whileHover={{scale: 1.03}}
                                      className="col-span-12 sm:col-span-6 lg:col-span-4"
                                  >
                                      <Link href={`/pariwisata/${item.tourism_id}`}>
                                          <div className="rounded-xl overflow-hidden shadow hover:shadow-lg transition-all bg-white dark:bg-darklight">
                                              <Image
                                                  src={item.photos[0] || "/images/placeholder.jpg"}
                                                  alt={item.tourism_name}
                                                  width={400}
                                                  height={260}
                                                  className="w-full h-52 object-cover"
                                              />
                                              <div className="p-5">
                                                  <h3 className="text-xl font-bold text-midnight_text dark:text-white mb-2">
                                                      {item.tourism_name}
                                                  </h3>
                                                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                                                      {item.description || "Tidak ada deskripsi."}
                                                  </p>
                                                  <p className="mt-2 text-sm text-primary">
                                                      📍 {item.village_name || "Desa tidak tersedia"}
                                                  </p>
                                              </div>
                                          </div>
                                      </Link>
                                  </motion.div>
                              ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default TourismPage;
