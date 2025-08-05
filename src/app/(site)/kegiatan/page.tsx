import KegiatanList from "@/app/components/KegiatanList";
import HeroSub from "@/app/components/SharedComponent/HeroSub";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Kegiatan",
};

// Ambil data dari API
const getArticles = async () => {
    const res = await fetch("https://keliling-keling-backend-98321.vercel.app/api/article", {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch articles");
    return res.json();
};

const Kegiatan = async () => {
    const articles = await getArticles();

    const posts = articles.map((item: any) => ({
        ...item,
        
        slug: item.article_id.toString(),
    }));

    const breadcrumbLinks = [
        {href: "/", text: "Home"},
        {href: "/kegiatan", text: "Kegiatan"},
    ];

    return (
        <>
            <HeroSub
                title="Kegiatan"
                description="Cerita dan kegiatan dari seluruh penjuru Keling."
                breadcrumbLinks={breadcrumbLinks}
            />
            <section className="flex flex-wrap justify-center dark:bg-darkmode">
                <div className="container px-4">
                    <div className="grid grid-cols-12 lg:px-4 px-0 gap-7">
                        {posts.map((kegiatan: any, i: number) => (
                            <div key={i} className="w-full lg:col-span-4 md:col-span-6 col-span-12">
                                <KegiatanList kegiatan={kegiatan} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Kegiatan;
