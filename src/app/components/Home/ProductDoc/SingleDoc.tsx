"use client";
import {Icon} from "@iconify/react";
import {motion} from "framer-motion";

type Doctype = {
    icon: string;
    title: string;
    text: string;
};

const SingleDoc = ({icon, title, text}: Doctype) => {
    return (
        <motion.div
            className="lg:col-span-4 sm:col-span-6 col-span-12"
            initial={{opacity: 0, y: 50}}
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: 0.6, ease: "easeOut"}}
            viewport={{once: true}}
        >
            <motion.div
                whileHover={{scale: 1.03}}
                className="border border-Snowy-sky md:px-15 md:py-3.438 p-8 rounded-2xl text-center lg:mb-0 bg-opacity-80 backdrop-blur-md transition duration-300"
            >
                <div className="rounded-full flex justify-center w-20 h-20 items-center mx-auto bg-Snowy-sky shadow-lg">
                    <span className="relative z-1">
                        <Icon icon={icon} width="35" height="35" className="font-semibold text-white" />
                    </span>
                </div>
                <h3 className="py-4 text-24 font-semibold text-white dark:text-white">{title}</h3>
                <p className="text-lg font-medium text-white/50">{text}</p>
            </motion.div>
        </motion.div>
    );
};

export default SingleDoc;
