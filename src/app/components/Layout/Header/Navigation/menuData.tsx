import {HeaderItem} from "../../../../types/menu";

export const headerData: HeaderItem[] = [
    {label: "Beranda", href: "/"},
    {label: "Profil Desa", href: "/profil-desa"},
    {label: "Kegiatan", href: "/kegiatan"},
    {
        label: "UMKM",
        href: "/umkm",
        submenu: [
            {label: "UMKM Desa Bumiharjo", href: "https://bumiharjo.jepara.go.id/lapak"},
            {label: "UMKM Desa Damarwulan", href: "https://damarwulan.jepara.go.id/lapak"},
            {label: "UMKM Desa Tempur", href: "https://tempur.jepara.go.id/lapak"},
            {label: "UMKM Desa Gelang", href: "https://damarwulan.jepara.go.id/lapak"},
            {label: "UMKM Desa Jlegong", href: "https://jlegong.jepara.go.id/lapak"},
            {label: "UMKM Desa Kaligarang", href: "https://kaligarang.jepara.go.id/lapak"},
            {label: "UMKM Desa Kelet", href: "https://kelet.jepara.go.id/lapak"},
            {label: "UMKM Desa Keling", href: "https://damarwulan.jepara.go.id/lapak"},
            {label: "UMKM Desa Klepu", href: "https://klepu.jepara.go.id/lapak"},
            {label: "UMKM Desa Kunir", href: "https://kunir.jepara.go.id/lapak"},
            {label: "UMKM Desa Tunahan", href: "https://tunahan.jepara.go.id/lapak"},
            {label: "UMKM Desa Watuaji", href: "https://watuaji.jepara.go.id/lapak"},
        ],
    },
    {label: "Pariwisata", href: "/pariwisata"},
];
