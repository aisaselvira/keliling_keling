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
        // submenu: [
        //     {label: "UMKM List", href: "/umkm"},
        //     {label: "UMKM details", href: "/UMKM/edtech-apps"},
        // ],
    },
];
