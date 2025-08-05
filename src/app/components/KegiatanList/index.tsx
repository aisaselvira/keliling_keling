import {format} from "date-fns";
import Image from "next/image";
import Link from "next/link";

const extractImageUrl = (url: string | undefined | null): string | null => {
    if (!url) return null;
    try {
        const parsed = new URL(url);
        if (parsed.hostname === "www.google.com" && parsed.pathname === "/imgres") {
            const imgurl = parsed.searchParams.get("imgurl");
            return imgurl ? decodeURIComponent(imgurl) : null;
        }
        return url;
    } catch {
        return null;
    }
};

function stripHtmlTags(html: string): string {
    return html.replace(/<[^>]*>/g, " ");
}

function truncateWords(text: string, wordLimit: number): string {
    const words = text.trim().split(/\s+/);
    return words.slice(0, wordLimit).join(" ") + (words.length > wordLimit ? "..." : "");
}

const KegiatanList = ({kegiatan}: {kegiatan: any}) => {
    const {title, photo, timestamp, content, article_id, writer, location} = kegiatan;

    const imageUrl = extractImageUrl(photo);
    const isValidDate = timestamp && !isNaN(Date.parse(timestamp));
    const formattedDate = isValidDate ? format(new Date(timestamp), "dd MMM yyyy") : "Tanggal tidak tersedia";

    return (
        <div className="group mb-10 relative p-6 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-darklight">
            {/* Gambar */}
            <div className="mb-5">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={title || "Gambar kegiatan"}
                        className="w-full h-auto rounded-md"
                        width={600}
                        height={400}
                        quality={85}
                    />
                ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-600 rounded-md">
                        No Image Available
                    </div>
                )}
            </div>

            {/* Judul */}
            <h3 className="text-2xl font-semibold mb-2 text-black dark:text-white">{title}</h3>

            {/* Tanggal, Lokasi, dan Penulis */}
            <div className="flex flex-wrap gap-2 text-xs mb-4">
                {formattedDate && (
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-white px-3 py-1 rounded-full">
                        📅 {formattedDate}
                    </span>
                )}
                {location && (
                    <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-white px-3 py-1 rounded-full">
                        📍 {location}
                    </span>
                )}
                {writer && (
                    <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-white px-3 py-1 rounded-full">
                        ✍️ {writer}
                    </span>
                )}
            </div>

            {/* Konten ringkasan */}
            {content ? (
                <p className="text-sm text-gray-800 dark:text-gray-300">{truncateWords(stripHtmlTags(content), 30)}</p>
            ) : (
                <p className="text-sm text-gray-500">Konten tidak tersedia</p>
            )}

            {/* Tombol Selengkapnya */}
            <div className="mt-6">
                <Link
                    href={`/kegiatan/${article_id}`}
                    className="inline-block text-sm font-semibold text-primary hover:text-orange-600 transition-colors"
                >
                    Baca Selengkapnya →
                </Link>
            </div>
        </div>
    );
};

export default KegiatanList;
