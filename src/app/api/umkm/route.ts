import { NextResponse } from 'next/server';

const ServicesData = [
  {
    title: "Kerajinan Anyaman Bu Siti",
    slug: "umkm-anyaman-bu-siti",
    description:
      "Anyaman dari daun pandan yang dibuat oleh UMKM Bu Siti di Desa Damarwulan. Produk meliputi tikar, tas, dan wadah serbaguna. Bahan alami, tahan lama, dan cocok untuk dekorasi rumah.",
    image: "/images/umkm/umkm-1.JPG",
    user_id: "Bu Siti",
    jenis: "Kerajinan Tangan",
    harga: "Rp 25.000 - Rp 150.000",
    shopee_url: "https://shopee.co.id/umkmdamarwulan" 
  },
  {
    title: "Kopi Robusta Gunung Muria",
    slug: "umkm-kopi-robusta",
    description:
      "Kopi robusta hasil panen dari lereng Gunung Muria oleh kelompok tani Keling. Diproses secara tradisional untuk menjaga cita rasa. Tersedia dalam bentuk bubuk dan biji kopi.",
    image: "/images/umkm/umkm-3.JPG",
    user_id: "Pak Joko",
    jenis: "Produk Pertanian",
    harga: "Rp 35.000 - Rp 70.000",
    shopee_url: "https://shopee.co.id/umkmdamarwulan" 
  },
  {
    title: "Batik Tulis Keling",
    slug: "umkm-batik-keling",
    description:
      "Batik tulis khas Kecamatan Keling dengan motif budaya Jepara. Menggunakan teknik pewarnaan alami. Tersedia sebagai kain, kemeja, dan pakaian jadi.",
    image: "/images/umkm/umkm-3.JPG",
    user_id: "UMKM Batik Keling",
    jenis: "Fashion & Kriya",
    harga: "Rp 100.000 - Rp 500.000",
    shopee_url: "https://shopee.co.id/umkmdamarwulan" 
  },
  {
    title: "Opak Singkong Damarwulan",
    slug: "umkm-opak-singkong",
    description:
      "Camilan tradisional dari singkong pilihan, diproses secara higienis tanpa bahan pengawet. Cocok untuk oleh-oleh khas Keling.",
    image: "/images/umkm/umkm-1.JPG",
    user_id: "Bu Marni",
    jenis: "Makanan Ringan",
    harga: "Rp 10.000 - Rp 25.000",
    shopee_url: "https://shopee.co.id/umkmdamarwulan" 
  },
  {
    title: "Jamu Tradisional Sehat Alami",
    slug: "umkm-jamu-tradisional",
    description:
      "Jamu racikan turun-temurun yang dipercaya berkhasiat untuk kebugaran dan kesehatan. Terbuat dari bahan alami tanpa tambahan kimia.",
    image: "/images/umkm/umkm-2.JPG",
    user_id: "Bu Yanti",
    jenis: "Kesehatan",
    harga: "Rp 15.000 - Rp 50.000",
    shopee_url: "https://shopee.co.id/umkmdamarwulan" 
  },
  {
    title: "Sambal Khas Keling",
    slug: "umkm-sambal-keling",
    description:
      "Sambal rumahan dengan resep khas Desa Keling, dibuat dari cabai lokal dan bumbu pilihan. Rasa pedas gurih cocok untuk lauk apapun.",
    image: "/images/umkm/umkm-3.JPG",
    user_id: "Pak Toni",
    jenis: "Produk Kuliner",
    harga: "Rp 20.000 - Rp 40.000",
    shopee_url: "https://shopee.co.id/umkmdamarwulan" 
  },
];

export const GET = () => {
  return NextResponse.json({
    ServicesData,
  });
};
