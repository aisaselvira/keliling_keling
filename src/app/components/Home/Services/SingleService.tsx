import Link from "next/link";
import Image from "next/image";
import {Icon} from "@iconify/react";

type ServiceType = {
    title: string;
    slug: string;
    description: string;
    image: string;
    user_id?: string;
    jenis?: string;
    harga?: string;
    shopeeUrl?: string;
};

const SingleService = ({service}: {service: ServiceType}) => {
    const {title, description, slug, image, user_id, jenis, harga, shopeeUrl} = service;

    return (
        <div className="xl:col-span-4 md:col-span-6 col-span-12">
            <div className="group relative bg-gradient-to-tr from-orange-100 to-yellow-50 dark:from-dark dark:to-darklight p-1 rounded-3xl transition-shadow duration-300 ease-in-out">
                <div className="h-full bg-white dark:bg-darklight rounded-[20px] p-6 flex flex-col justify-between transform transition-transform duration-300 group-hover:scale-[1.015] border border-orange-200 dark:border-gray-700 shadow-md group-hover:shadow-xl">
                    {/* Gambar */}
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4">
                        <Image
                            src={image}
                            alt={title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            quality={90}
                            className="object-cover rounded-xl group-hover:scale-105 transition-transform duration-500 ease-in-out"
                        />
                    </div>

                    {/* Konten */}
                    <div className="flex flex-col gap-3 flex-grow">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white leading-snug line-clamp-2">
                            {title}
                        </h3>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-2 text-sm mb-2">
                            {user_id && (
                                <span className="bg-gradient-to-r from-sky-400 to-sky-600 text-white px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
                                    <Icon icon="mdi:account" className="text-base" />
                                    {user_id}
                                </span>
                            )}
                            {jenis && (
                                <span className="bg-gradient-to-r from-pink-400 to-pink-600 text-white px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
                                    <Icon icon="mdi:tag-multiple" className="text-base" />
                                    {jenis}
                                </span>
                            )}
                            {harga && (
                                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
                                    <Icon icon="mdi:currency-idr" className="text-base" />
                                    {harga}
                                </span>
                            )}
                        </div>

                        {/* Deskripsi */}
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">{description}</p>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex flex-wrap gap-3 mt-4">
                        <Link
                            href={`/umkm/${slug}`}
                            className="flex gap-2 items-center font-semibold text-primary hover:text-orange-600 transition-colors"
                        >
                            <span className="relative">
                                Read More
                                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-orange-400 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                            </span>
                            <Icon
                                icon="solar:alt-arrow-right-linear"
                                width="20"
                                height="20"
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </Link>

                        {shopeeUrl && (
                            <a
                                href={shopeeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm font-medium bg-[#FF5722] text-white px-4 py-2 rounded-lg hover:bg-[#e64a19] transition-colors"
                            >
                                <Icon icon="simple-icons:shopee" className="text-lg" />
                                Beli di Shopee
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleService;
