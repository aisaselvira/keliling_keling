import ServicesCard from "@/app/components/Services/ServiceCard";
import HeroSub from "@/app/components/SharedComponent/HeroSub";
import {Metadata} from "next";
export const metadata: Metadata = {
    title: "UMKM",
};

const page = () => {
    const breadcrumbLinks = [
        {href: "/", text: "Home"},
        {href: "/umkm", text: "UMKM"},
    ];
    return (
        <>
            <HeroSub
                title="UMKM"
                description="Jelajahi potensi ekonomi desa melalui produk-produk unggulan buatan warga Keling."
                breadcrumbLinks={breadcrumbLinks}
            />
            <ServicesCard />
        </>
    );
};

export default page;
