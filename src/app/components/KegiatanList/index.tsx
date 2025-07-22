import {Kegiatan} from "@/app/types/kegiatan";
import {format} from "date-fns";
import Image from "next/image";
import Link from "next/link";

const KegiatanList = ({kegiatan}: {kegiatan: Kegiatan}) => {
    const {title, coverImage, excerpt, date, slug} = kegiatan;

    return (
        <div className="group mb-10 relative">
            <div className="mb-8 overflow-hidden rounded">
                <Link href={`/kegiatan/${slug}`} aria-label="kegiatan cover" className="block h-72">
                    <Image
                        src={coverImage!}
                        alt="image"
                        className="w-full transition group-hover:scale-125 h-full"
                        width={408}
                        height={272}
                        layout="responsive"
                        quality={100}
                    />
                </Link>
            </div>
            <div>
                <h3>
                    <Link
                        href={`/kegiatan/${slug}`}
                        className="mb-4 inline-block font-semibold text-dark group-hover:text-primary dark:text-white dark:group-hover:text-primary text-xl"
                    >
                        {title}
                    </Link>
                </h3>
                <span className="text-xs font-semibold leading-loose text-black/50 dark:text-white/50">
                    {format(new Date(date), "dd MMM yyyy")}
                </span>
            </div>
        </div>
    );
};
export default KegiatanList;
