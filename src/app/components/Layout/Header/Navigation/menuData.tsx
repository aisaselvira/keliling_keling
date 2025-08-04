import {HeaderItem} from "../../../../types/menu";

export const headerData: HeaderItem[] = [
    {label: "Beranda", href: "/"},
    {label: "Profil Desa", href: "/profil-desa"},
    {
        label: "Kegiatan",
        href: "/kegiatan",
        // submenu: [
        //     {label: "Blog list", href: "/kegiatan"},
        //     {label: "Blog details", href: "/kegiatan/blog_1"},
        // ],
    },
    {
        label: "UMKM",
        href: "/umkm",
        submenu: [
            {label: "UMKM Desa Bumiharjo", href: "https://damarwulan.jepara.go.id/lapak"},
            {label: "UMKM Desa Damarwulan", href: "https://damarwulan.jepara.go.id/lapak"},
            {label: "UMKM Desa Tempur", href: "/umkm"},
            {label: "UMKM Desa Gelang", href: "https://damarwulan.jepara.go.id/lapak"},
            {label: "UMKM Desa Jlegong", href: "/umkm"},
            {label: "UMKM Desa Kaligarang", href: "https://damarwulan.jepara.go.id/lapak"},
            {label: "UMKM Desa Kelet", href: "/umkm"},
            {label: "UMKM Desa Keling", href: "https://damarwulan.jepara.go.id/lapak"},
            {label: "UMKM Desa Klepu", href: "/umkm"},
            {label: "UMKM Desa Kunir", href: "https://damarwulan.jepara.go.id/lapak"},
            {label: "UMKM Desa Tunahan", href: "/umkm"},
            {label: "UMKM Desa Watuaji", href: "https://damarwulan.jepara.go.id/lapak"},
        ],
    },
];
