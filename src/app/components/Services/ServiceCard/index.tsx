"use client";
import {useState, useEffect} from "react";
import SingleService from "../../Home/Services/SingleService";
import SkeletonCard from "../../Skeleton/ServiceCard/page";
import {FaMapMarkerAlt} from "react-icons/fa";

const desaList = [
    "Bumiharjo",
    "Damarwulan",
    "Tempur",
    "Gelang",
    "Jlegong",
    "Kaligarang",
    "Kelet",
    "Keling",
    "Klepu",
    "Kunir",
    "Tunahan",
    "Watuaji",
];

const warnaDesa = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-rose-500",
    "bg-orange-500",
    "bg-cyan-500",
    "bg-lime-500",
    "bg-amber-500",
    "bg-fuchsia-500",
];

const ServicesCard = () => {
    const [services, setServices] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDesa, setSelectedDesa] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/umkm");
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setServices(data.ServicesData || []);
                setFiltered(data.ServicesData || []);
            } catch (error) {
                console.error("Error fetching umkm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleFilter = (desa: string) => {
        setSelectedDesa(desa);
        if (desa === "") {
            setFiltered(services);
        } else {
            setFiltered(services.filter((item) => item.desa === desa));
        }
    };

    return (
        <section className="dark:bg-darkmode bg-[url('/images/plan/price-plan-background-icons.svg')] bg-auto bg-center bg-no-repeat py-20">
            <div className="container mx-auto lg:max-w-5xl px-4">
                <div className="mb-10 text-center">
                    <h3 className="font-semibold lg:text-6xl sm:text-5xl text-3xl text-black dark:text-white">
                        Dari desa untuk semua: <br /> dukung pelaku UMKM dan gerakkan ekonomi Keling
                    </h3>
                </div>

                {/* Tombol Desa */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    <button
                        onClick={() => handleFilter("")}
                        className={`px-4 py-2 rounded-full text-white font-medium transition hover:scale-105 bg-gray-600`}
                    >
                        Semua Desa
                    </button>
                    {desaList.map((desa, i) => (
                        <button
                            key={desa}
                            onClick={() => handleFilter(desa)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium transition hover:scale-105 ${
                                warnaDesa[i % warnaDesa.length]
                            } ${selectedDesa === desa ? "ring-4 ring-white" : ""}`}
                        >
                            <FaMapMarkerAlt />
                            UMKM Desa {desa}
                        </button>
                    ))}
                </div>

                {/* Grid UMKM */}
                <div className="grid grid-cols-12 gap-6">
                    {loading
                        ? Array.from({length: 6}).map((_, index) => <SkeletonCard key={index} />)
                        : filtered.map((item, index) => <SingleService key={index} service={item} />)}
                </div>
            </div>
        </section>
    );
};

export default ServicesCard;
