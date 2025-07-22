import KegiatanList from "@/app/components/KegiatanList";
import HeroSub from "@/app/components/SharedComponent/HeroSub";
import {getAllPosts} from "@/utils/markdown";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Kegiatan",
};

const Kegiatan = () => {
    const posts = getAllPosts(["title", "date", "excerpt", "coverImage", "slug"]);

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
                        {posts.map((kegiatan, i) => (
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
