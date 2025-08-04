import type {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import {format} from "date-fns";
import {notFound} from "next/navigation";

function extractValidImageUrl(googleImageUrl: string | null): string {
    if (!googleImageUrl) return "/images/placeholder.jpg";
    try {
        const parsed = new URL(googleImageUrl);
        const imgurl = parsed.searchParams.get("imgurl");
        return imgurl ? decodeURIComponent(imgurl) : googleImageUrl;
    } catch (e) {
        return "/images/placeholder.jpg";
    }
}

async function getArticleDetail(id: string) {
    try {
        const res = await fetch(`https://keliling-keling-backend-98321.vercel.app/api/article/${id}`, {
            next: {revalidate: 60},
        });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

// ✅ Pakai inline type langsung
export async function generateMetadata({params}: {params: {slug: string}}): Promise<Metadata> {
    const post = await getArticleDetail(params.slug);
    return {
        title: post?.title || "Artikel | Kelingan Keling",
        description: post?.content?.slice(0, 150) || "Detail artikel kegiatan",
    };
}

// ✅ Pakai inline type langsung
export default async function Page({params}: {params: {slug: string}}) {
    const post = await getArticleDetail(params.slug);
    if (!post) return notFound();

    const imageUrl = extractValidImageUrl(post.photo);
    const formattedDate = format(new Date(post.timestamp), "dd MMM yyyy");

    return (
        <>
            <section className="relative dark:bg-darkmode pt-7.5! pb-8!">
                <div className="container lg:max-w-xl md:max-w-screen-md mx-auto px-4">
                    <div className="grid md:grid-cols-12 grid-cols-1 items-center">
                        <div className="col-span-8">
                            <h2 className="text-midnight_text dark:text-white md:text-[40px] leading-tight text-4xl font-bold pt-7">
                                {post.title}
                            </h2>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {formattedDate && (
                                    <span className="text-lg bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-white px-3 py-1 rounded-full">
                                        📅 {formattedDate}
                                    </span>
                                )}
                                {post.location && (
                                    <span className="text-lge bg-green-100 text-green-800 dark:bg-green-900 dark:text-white px-3 py-1 rounded-full">
                                        📍 {post.location}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center md:justify-center justify-start gap-6 col-span-4 pt-4 md:pt-0">
                            <Image
                                src="/images/artikel/icon-profil.webp"
                                alt="penulis"
                                className="bg-no-repeat bg-contain inline-block rounded-full !w-20 !h-20"
                                width={40}
                                height={40}
                                layout="responsive"
                                quality={100}
                            />
                            <div>
                                <span className="text-xl font-bold text-midnight_text dark:text-white">
                                    {post.writer || "Penulis"}
                                </span>
                                <p className="text-xl text-gray dark:text-white">Penulis</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="dark:bg-darkmode pt-4!">
                <div className="container lg:max-w-xl md:max-w-screen-md mx-auto px-4">
                    <div className="grid-cols-3 grid">
                        <div className="z-20 mb-24 max-h-[550px] overflow-hidden rounded col-span-3">
                            <Image
                                src={imageUrl}
                                alt="cover"
                                width={1170}
                                height={766}
                                className="h-full w-full object-cover rounded-3xl"
                            />
                        </div>
                        <div className="lg:col-span-2 col-span-3">
                            <div className="blog-details xl:pr-10">
                                <div
                                    className="prose dark:prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{__html: post.content}}
                                />
                            </div>
                        </div>
                        <div className="lg:col-span-1 col-span-3">
                            <div className="mb-8 flex flex-col">
                                <div className="w-full py-12 px-11 bg-white dark:bg-darklight shadow-lg border-b-2 border-lightborder dark:border-darkborder rounded-t-lg">
                                    <h2 className="relative mb-5 dark:text-white text-black text-3xl font-medium">
                                        Share
                                    </h2>
                                    <div className="flex gap-4 flex-col">
                                        <div className="bg-[#526fa3] py-4 px-6 text-xl rounded-lg text-white">
                                            <Link href="#">Facebook</Link>
                                        </div>
                                        <div className="bg-[#46C4FF] py-4 px-6 text-xl rounded-lg text-white">
                                            <Link href="#">Twitter</Link>
                                        </div>
                                        <div className="bg-[#3C86AD] py-4 px-6 text-xl rounded-lg text-white">
                                            <Link href="#">LinkedIn</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
