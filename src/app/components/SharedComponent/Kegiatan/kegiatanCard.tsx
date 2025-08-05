import {format} from "date-fns";
import Image from "next/image";
import Link from "next/link";

// Fungsi untuk membersihkan tag HTML dari content
const stripHTML = (html: string) => {
    if (typeof window === "undefined") return html;
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
};

const KegiatanCard = ({kegiatan}: {kegiatan: any}) => {
    const formattedDate =
        kegiatan?.timestamp && !isNaN(new Date(kegiatan.timestamp).getTime())
            ? format(new Date(kegiatan.timestamp), "dd MMM yyyy")
            : "";

    return (
        <div className="group relative">
            <Link href={`/kegiatan/${kegiatan.article_id}`}>
                {kegiatan.photo ? (
                    <Image
                        src={kegiatan.photo}
                        alt={kegiatan.title || "Foto Kegiatan"}
                        width={500}
                        height={300}
                        className="rounded-lg w-full h-60 object-cover"
                    />
                ) : (
                    <div className="bg-gray-200 w-full h-60 flex items-center justify-center text-gray-500 text-sm rounded-lg">
                        Tidak ada gambar
                    </div>
                )}
            </Link>

            <div className="pt-4">
                <h3 className="text-lg font-bold text-dark dark:text-white">
                    <Link href={`/kegiatan/${kegiatan.article_id}`}>{kegiatan.title || "Tanpa Judul"}</Link>
                </h3>

                <div className="flex flex-wrap items-center gap-2 mt-2">
                    {formattedDate && (
                        <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-white px-3 py-1 rounded-full">
                            📅 {formattedDate}
                        </span>
                    )}
                    {kegiatan.location && (
                        <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-white px-3 py-1 rounded-full">
                            📍 {kegiatan.location}
                        </span>
                    )}
                    {kegiatan.writer && (
                        <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-white px-3 py-1 rounded-full">
                            ✍️ {kegiatan.writer}
                        </span>
                    )}
                </div>

                <p className="mt-3 text-sm text-black dark:text-white line-clamp-3">{stripHTML(kegiatan.content)}</p>
            </div>
        </div>
    );
};

export default KegiatanCard;
