"use client";
import {useState, useEffect} from "react";
import SingleService from "../../Home/Services/SingleService";
import SkeletonCard from "../../Skeleton/ServiceCard/page";
import {FaMapMarkerAlt, FaSearch, FaExclamationCircle} from "react-icons/fa";

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

const desaLinks: Record<string, string> = {
    Damarwulan: "https://damarwulan.jepara.go.id/lapak",
    Tempur: "https://tempur.jepara.go.id/lapak",
    Gelang: "https://gelang.jepara.go.id/lapak",
    Bumiharjo: "https://bumiharjo.jepara.go.id/lapak",
    Jlegong: "https://jlegong.jepara.go.id/lapak",
    Kaligarang: "https://kaligarang.jepara.go.id/lapak",
    Kelet: "https://kelet.jepara.go.id/lapak",
    Keling: "https://keling.jepara.go.id/lapak",
    Klepu: "https://klepu.jepara.go.id/lapak",
    Kunir: "https://kunir.jepara.go.id/lapak",
    Tunahan: "https://tunahan.jepara.go.id/lapak",
    Watuaji: "https://watuaji.jepara.go.id/lapak",
};

const ServicesCard = () => {
    const [services, setServices] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDesa, setSelectedDesa] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("https://keliling-keling-backend-98321.vercel.app/api/umkm");
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setServices(data || []);
                setFiltered(data || []);
            } catch (error) {
                console.error("Error fetching UMKM:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleFilter = (desa: string, keyword: string = searchKeyword) => {
        setSelectedDesa(desa);
        const filteredData = services.filter((item) => {
            const matchDesa = desa === "" || item.village_name === desa || item.village_name === `Desa ${desa}`;
            const matchKeyword = item.business_name.toLowerCase().includes(keyword.toLowerCase());
            return matchDesa && matchKeyword;
        });
        setFiltered(filteredData);
    };

    const handleSearch = (keyword: string) => {
        setSearchKeyword(keyword);
        handleFilter(selectedDesa, keyword);
    };

    return (
        <section className="dark:bg-darkmode bg-[url('/images/plan/price-plan-background-icons.svg')] bg-auto bg-center bg-no-repeat py-20">
            <div className="container mx-auto lg:max-w-5xl px-4">
                <div className="mb-10 text-center">
                    <h3 className="font-semibold lg:text-6xl sm:text-5xl text-3xl text-black dark:text-white">
                        Dari desa untuk semua: <br /> dukung pelaku UMKM dan gerakkan ekonomi Keling
                    </h3>
                </div>

                {/* Tombol Link ke Web Desa */}
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                    <button
                        onClick={() => handleFilter("")}
                        className="px-4 py-2 rounded-full text-white font-medium transition hover:scale-105 bg-gray-600"
                    >
                        Semua Desa
                    </button>

                    {desaList.map((desa, i) => (
                        <a
                            key={desa}
                            href={desaLinks[desa] || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium transition hover:scale-105 ${
                                warnaDesa[i % warnaDesa.length]
                            }`}
                        >
                            <FaMapMarkerAlt />
                            UMKM Desa {desa}
                        </a>
                    ))}
                </div>

                {/* Filter Pencarian + Dropdown */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 mb-10 w-full px-4 max-w-6xl mx-auto">
                    {/* Input Search - full width */}
                    <div className="relative w-full sm:w-[38rem]">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari nama UMKM..."
                            className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkmode text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchKeyword}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>

                    {/* Dropdown Desa - diperlebar */}
                    <select
                        className="px-4 py-2 w-full sm:w-[24rem] rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkmode text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedDesa}
                        onChange={(e) => handleFilter(e.target.value)}
                    >
                        <option value="">Pilih Desa</option>
                        {desaList.map((desa) => (
                            <option key={desa} value={desa}>
                                {desa}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Grid UMKM */}
                <div className="grid grid-cols-12 gap-6">
                    {loading ? (
                        Array.from({length: 6}).map((_, index) => <SkeletonCard key={index} />)
                    ) : filtered.length === 0 ? (
                        <div className="col-span-12 flex flex-col items-center justify-center text-center py-10">
                            <FaExclamationCircle className="text-4xl text-gray-400 mb-2" />
                            <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">UMKM Tidak Ditemukan</p>
                        </div>
                    ) : (
                        filtered.map((item, index) => <SingleService key={index} service={item} />)
                    )}
                </div>
            </div>
        </section>
    );
};

export default ServicesCard;
