import React, {FC} from "react";
import Image from "next/image";
import {Kegiatan} from "@/app/types/kegiatan";
import {format} from "date-fns";
import Link from "next/link";

const KegiatanCard = ({kegiatan}: {kegiatan: Kegiatan}) => {
    const {title, coverImage, excerpt, date, slug} = kegiatan;
    return (
        <>
            <div className="group mb-0 relative">
                <div className="mb-8 overflow-hidden rounded">
                    <Link href={`/kegiatan/${slug}`} aria-label="kegiatan cover" className="block">
                        <Image
                            src={coverImage!}
                            alt="image"
                            className="w-full transition group-hover:scale-125"
                            width={408}
                            height={272}
                            style={{width: "100%", height: "auto"}}
                            quality={100}
                        />
                    </Link>
                </div>
                <div>
                    <h3>
                        <Link
                            href={`/kegiatan/${slug}`}
                            className="mb-4 inline-block font-semibold text-dark text-black hover:text-primary dark:text-white dark:hover:text-primary text-[22px] leading-tight"
                        >
                            {title}
                        </Link>
                    </h3>
                    <span className="text-sm font-semibold leading-loose text-SereneGray">
                        {format(new Date(date), "dd MMM yyyy")}
                    </span>
                </div>
            </div>
        </>
    );
};

export default KegiatanCard;
