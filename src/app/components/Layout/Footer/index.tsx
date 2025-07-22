"use client";
import React, {FC} from "react";
import Link from "next/link";
import Image from "next/image";
import {Icon} from "@iconify/react";

const Footer: FC = () => {
    return (
        <footer className="bg-Dark-primary dark:bg-darklight py-17 pb-6">
            <div className="container mx-auto lg:max-w-xl md:max-w-screen-md px-4">
                <div className="grid grid-cols-12 sm:gap-1.875 gap-5">
                    <div className="lg:col-span-4 col-span-12">
                        <div className="md:pe-7.5">
                            <Link href="/">
                                <Image src="/images/logo/logo-keliling-keling.svg" alt="Logo" width={151} height={32} />
                            </Link>
                            <p className="mb-0 font-medium text-lg text-white/50 pt-2.188 pb-1.875">
                                Portal informasi desa-desa di Kecamatan Keling yang memudahkan akses informasi dan
                                layanan secara terpadu.
                            </p>
                        </div>
                    </div>
                    <div className="lg:col-span-2 sm:col-span-6 col-span-12">
                        <h4 className="text-lg text-white font-medium mb-2.375">Menu Utama</h4>
                        <ul>
                            <li className="pb-1.563">
                                <Link href="/" className="text-lg font-medium text-white/50 hover:text-primary">
                                    Beranda
                                </Link>
                            </li>
                            <li className="pb-1.563">
                                <Link href="/profil" className="text-lg font-medium text-white/50 hover:text-primary">
                                    Profil Desa
                                </Link>
                            </li>
                            <li className="pb-1.563">
                                <Link href="/kegiatan" className="text-lg font-medium text-white/50 hover:text-primary">
                                    Kegiatan
                                </Link>
                            </li>
                            <li className="pb-1.563">
                                <Link href="/umkm" className="text-lg font-medium text-white/50 hover:text-primary">
                                    UMKM
                                </Link>
                            </li>
                            <li className="pb-1.563">
                                <Link
                                    href="/pariwisata"
                                    className="text-lg font-medium text-white/50 hover:text-primary"
                                >
                                    Pariwisata
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="lg:col-span-6 md:col-span-7 col-span-12">
                        <h4 className="text-lg text-white font-medium sm:mb-2.375 mb-6">Kontak</h4>
                        <p className="text-lg text-white/50 font-medium mb-4">
                            Dapatkan kabar dan info terbaru dari Desa kami
                        </p>
                        <div className="flex sm:flex-nowrap flex-wrap items-center gap-2">
                            <input
                                type="email"
                                name="Email"
                                id="email"
                                placeholder="Kirim alamat email"
                                className="text-base font-medium py-4 px-5 !rounded-lg dark:text-white dark:bg-darkmode h-full border border-border_color focus:border-primary dark:border-border_color dark:focus:border-primary"
                            />
                            <Link
                                href="/profil-desa"
                                className="py-4 px-2.188 bg-primary text-white hover:bg-orange-600 rounded-lg duration-500 sm:w-fit w-full"
                            >
                                Kirim
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex md:flex-nowrap flex-wrap gap-6 items-center justify-between sm:pt-17 pt-10">
                    <p className="text-lg font-medium text-white/50">©2025 - Tim KKN PPM UGM 2025 - Keling Berdering</p>
                    <div className="flex gap-6 items-center">
                        <Link
                            href="#"
                            className="p-2 border-2 bg-transparent border-primary rounded-full group hover:bg-primary hover:border-primary"
                        >
                            <Icon
                                icon="grommet-icons:facebook-option"
                                width="24"
                                height="24"
                                className="text-primary group-hover:text-white"
                            />
                        </Link>
                        <Link
                            href="#"
                            className="p-2 border-2 bg-transparent border-primary rounded-full group hover:bg-primary hover:border-primary"
                        >
                            <Icon
                                icon="mage:twitter"
                                width="24"
                                height="24"
                                className="text-primary group-hover:text-white"
                            />
                        </Link>
                        <Link
                            href="#"
                            className="p-2 border-2 bg-transparent border-primary rounded-full group hover:bg-primary hover:border-primary"
                        >
                            <Icon
                                icon="jam:google-plus"
                                width="24"
                                height="24"
                                className="text-primary group-hover:text-white"
                            />
                        </Link>
                        <Link
                            href="#"
                            className="p-2 border-2 bg-transparent border-primary rounded-full group hover:bg-primary hover:border-primary"
                        >
                            <Icon
                                icon="typcn:social-linkedin"
                                width="24"
                                height="24"
                                className="text-primary group-hover:text-white"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
