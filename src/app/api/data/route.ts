import { NextResponse } from 'next/server';

const Technologies = [
  {
    base: "devicon:nextjs",
    styling: "devicon:tailwindcss",
  },
  {
    base: "devicon:react",
    styling: "devicon:tailwindcss",
  },
];

const DocText = [
  {
    icon: "tabler:brand-github",
    title: "Github Sync",
    text: "Sumber pengembangan web desa dapat diakses melalui repositori Github yang terbuka.",
  },
  {
    icon: "tabler:crown",
    title: "Branding",
    text: "Setiap desa memiliki identitas dan profil khas yang diperkuat melalui media digital.",
  },
  {
    icon: "tabler:message-circle",
    title: "Comments",
    text: "Fitur komentar bisa ditambahkan untuk interaksi masyarakat terhadap kegiatan desa.",
  },
];

const Beranda = [
  {
    image: "/images/productdoc/Portfolio-1.jpg",
  },
  {
    image: "/images/productdoc/Portfolio-2.jpg",
  },
  {
    image: "/images/productdoc/Portfolio-3.jpg",
  },
  {
    image: "/images/productdoc/Portfolio-4.jpg",
  },
  {
    image: "/images/productdoc/Portfolio-5.jpg",
  },
];

const MonthlyPlans = [
  {
    type: "Basic",
    price: 0,
    text: "Gratis untuk semua desa di Keling",
    benefits: [
      "Profil Desa Digital",
      "Dokumentasi Kegiatan",
      "Daftar UMKM Lokal",
    ],
  },
];

const yearlyPlans = MonthlyPlans;

const Questions = [
  {
    question: "Apa itu Keliling Keling?",
    answer:
      "Keliling Keling adalah platform digital yang menampilkan profil, kegiatan, dan potensi UMKM dari seluruh desa di Kecamatan Keling.",
  },
  {
    question: "Berapa desa yang tergabung dalam website ini?",
    answer:
      "Terdapat 13 desa di Kecamatan Keling yang informasinya ditampilkan, mulai dari Bumiharjo hingga Watuaji.",
  },
  {
    question: "Apakah informasi UMKM desa bisa dicari berdasarkan desa?",
    answer:
      "Ya. Anda dapat memfilter daftar UMKM berdasarkan desa untuk menemukan pelaku usaha dari wilayah tertentu.",
  },
  {
    question: "Apa saja fitur utama di website ini?",
    answer:
      "Fitur utama meliputi Beranda, Profil Desa, Kegiatan Masyarakat, dan UMKM Lokal.",
  },
  {
    question: "Dari mana data dan foto kegiatan diperoleh?",
    answer:
      "Semua konten berasal dari kerjasama dengan pemerintah desa, dokumentasi lapangan, dan kontribusi mahasiswa KKN.",
  },
  {
    question: "Apakah warga bisa mengusulkan perubahan data?",
    answer:
      "Ya, silakan hubungi tim pengelola web atau perangkat desa setempat untuk pengajuan update data.",
  },
];

const Testimonial = [
  {
    review:
      "Situs ini sangat membantu dalam mengenalkan UMKM kami kepada masyarakat luas.",
    name: "Bu Siti Aminah",
    post: "Pelaku UMKM Desa Kunir",
    Image: "/images/profile.png",
  },
  {
    review:
      "Sekarang profil desa kami bisa diakses siapa pun lewat internet, sangat bermanfaat.",
    name: "Pak Mulyono",
    post: "Kepala Desa Tempur",
    Image: "/images/profile.png",
  },
];

const partners = [
  {
    image: "/images/info/jepara.svg",
  },
  {
    image: "/images/info/jateng.svg",
  },
];

export const GET = () => {
  return NextResponse.json({
    Technologies,
    DocText,
    Beranda,
    MonthlyPlans,
    yearlyPlans,
    Questions,
    Testimonial,
    partners,
  });
};
