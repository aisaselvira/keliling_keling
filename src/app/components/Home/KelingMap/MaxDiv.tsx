"use client";

import React from "react";
import clsx from "clsx";

type MaxDivProps = {
    desa: string | null;
    description: string | null;
};

const MaxDiv: React.FC<MaxDivProps> = ({desa, description}) => {
    return (
        <div
            className={clsx(
                "relative transition-all duration-500 ease-in-out",
                "bg-white dark:bg-darklight",
                "rounded-2xl shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700",
                "p-8 max-w-full min-h-[300px] flex items-center justify-center"
            )}
        >
            {desa ? (
                <div
                    className={clsx(
                        "w-full",
                        "transition-all duration-700 ease-out transform scale-100 animate-fade-in-up"
                    )}
                >
                    {/* Judul Desa dalam card mini */}
                    <div
                        className={clsx(
                            "rounded-lg px-5 py-3 mb-6 text-center font-bold text-2xl tracking-wide",
                            "shadow-md transition-colors duration-500",
                            "bg-Dark-primary text-white dark:bg-white dark:text-Dark-primary"
                        )}
                    >
                        {desa}
                    </div>

                    {/* Deskripsi dengan efek lembut */}
                    <div className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {description}
                    </div>
                </div>
            ) : (
                <p className="text-gray-500 dark:text-gray-400 italic text-center text-xl">
                    Klik salah satu wilayah desa pada peta untuk melihat informasi.
                </p>
            )}
        </div>
    );
};

export default MaxDiv;
