"use client"

import * as React from "react"
import { DataTable } from "@/app/components/Admin/DataTable"
import Link from "next/link"
import { Plus } from "lucide-react"
import { columns, UMKM } from "@/app/components/Admin/UMKM/Columns"
import VillageDropdown, { UMKMItem } from "@/app/components/Admin/UMKM/Dropdown"
import { Skeleton } from "@/components/ui/skeleton"

export default function UMKMListPage() {
  const [data, setData] = React.useState<UMKM[]>([])
  const [allData, setAllData] = React.useState<UMKM[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL 

  const mapRaw = (raw: any): UMKM => ({
    id: String(raw.business_id),
    name: raw.business_name,
    created_by_name: raw.created_by_name,
    category: (raw.category_name?.toLowerCase() as UMKM["category"]) || "archived",
    village: raw.village_name,
    owner: raw.owner,
    publishedAt: raw.created_at,
    photos: Array.isArray(raw.photos) ? raw.photos : [],
    price: raw.price || "—",
  })

  React.useEffect(() => {
    const fetchUMKM = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${baseUrl}/api/umkm`, {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const raw = await res.json()
        const mapped: UMKM[] = Array.isArray(raw) ? raw.map(mapRaw) : []
        setAllData(mapped)
        setData(mapped)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUMKM()
  }, [baseUrl])

  const handleFilter = React.useCallback(
    (filtered: UMKMItem[], selectedVillage: string) => {
      if (!selectedVillage) {
        setData(allData)
        return
      }

      const mapped: UMKM[] = filtered.map((r) =>
        mapRaw({
          business_id: r.business_id,
          business_name: r.business_name,
          village_name: r.village_name,
          created_by_name: r.created_by_name,
          category_name: r.category_name,
          owner: r.owner,
          created_at: r.created_at,
          photos: r.photos,
          price: r.price,
        })
      )
      setData(mapped)
    },
    [allData]
  )

  return (
    <div className="mt-16 container mx-auto py-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Kiri: Judul dan Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <h1 className="text-2xl font-bold whitespace-nowrap text-black">Daftar UMKM</h1>
          <VillageDropdown onFilter={handleFilter} placeholder="Semua desa" />
        </div>

        {/* Kanan: Tombol */}
        <Link href="/admin/umkm/new" passHref>
          <button className="mr-8 inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded-md whitespace-nowrap">
            <Plus className="h-4 w-4" />
            Buat Data UMKM Baru
          </button>
        </Link>
      </div>

      {/* Loading / Error / Empty / Data Table */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 text-red-500">
          Error fetching UMKM: {error}
        </div>
      ) : data.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          Tidak ada data UMKM yang tersedia.
        </div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  )
}
