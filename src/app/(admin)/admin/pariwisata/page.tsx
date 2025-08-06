"use client"

import * as React from "react"
import { DataTable } from "@/app/components/Admin/DataTable"
import Link from "next/link"
import { Plus } from "lucide-react"
import { columns, Pariwisata } from "@/app/components/Admin/Pariwisata/Columns"
import VillageDropdown, { PariwisataItem } from "@/app/components/Admin/Pariwisata/Dropdown"
import { Skeleton } from "@/components/ui/skeleton"

export default function PariwisataListPage() {
  const [data, setData] = React.useState<Pariwisata[]>([])
  const [allData, setAllData] = React.useState<Pariwisata[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const mapRaw = (raw: any): Pariwisata => ({
    id: String(raw.tourism_id),
    name: raw.tourism_name,
    created_by_name: raw.created_by_name,
    village: raw.village_name,
    publishedAt: raw.created_at,
    location: raw.address || "—",
    photos: Array.isArray(raw.photos) ? raw.photos : [],
  })

  React.useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${baseUrl}/api/tourism`, {
          cache: "no-store",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const raw = await res.json()
        const mapped: Pariwisata[] = Array.isArray(raw) ? raw.map(mapRaw) : []
        setAllData(mapped)
        setData(mapped)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [baseUrl])

  const handleFilter = React.useCallback(
    (filtered: PariwisataItem[], selectedVillage: string) => {
      if (!selectedVillage) {
        setData(allData)
        return
      }
      const mapped: Pariwisata[] = filtered.map((r) =>
        mapRaw({
          tourism_id: r.tourism_id,
          tourism_name: r.tourism_name,
          village_name: r.village_name,
          created_by_name: r.created_by_name,
          created_at: r.created_at,
          address: r.address,
          photos: r.photos,
        })
      )
      setData(mapped)
    },
    [allData]
  )

  return (
    <div className="mt-16 mx-auto py-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 mr-8">
        {/* Kiri: Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <h1 className="text-2xl font-bold whitespace-nowrap text-black">Daftar Pariwisata</h1>
          <VillageDropdown onFilter={handleFilter} placeholder="Semua desa" />
        </div>

        {/* Kanan: Tombol Buat Baru */}
        <Link href="/admin/pariwisata/new" passHref>
          <button className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded-md whitespace-nowrap mx-auto">
            <Plus className="h-4 w-4" />
            Buat Data Pariwisata Baru
          </button>
        </Link>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 text-red-500">
          Error fetching pariwisata: {error}
        </div>
      ) : data.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          Tidak ada data pariwisata yang tersedia.
        </div>
      ) : (
        <div className="md:w-full overflow-x-auto">
  <div className="md:min-w-[700">
    <DataTable columns={columns} data={data} />
  </div>
</div>
      )}
    </div>
  )
}
