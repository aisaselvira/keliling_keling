"use client"

import * as React from "react"
import { DataTable } from "@/app/components/Admin/DataTable"
import Link from "next/link"
import { Plus } from "lucide-react"
import { columns, Desa } from "@/app/components/Admin/Desa/Columns"
import { Skeleton } from "@/components/ui/skeleton" 

export default function DesaListPage() {
  const [data, setData] = React.useState<Desa[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  React.useEffect(() => {
    const fetchVillages = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/village`, {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const raw = await res.json()

        const mapped: Desa[] = raw.map((a: any) => ({
          id: String(a.village_id),
          name: a.village_name,
          created_by_name: a.created_by_name,
          district: a.district,
          address: a.address || "—",
        }))
        setData(mapped)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchVillages()
  }, [])

  if (loading)
    return (
      <div className="mt-16 container mx-auto py-10">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-36" />
        </div>

        {/* Tabel skeleton */}
        <div className="border rounded-md overflow-x-auto p-4 space-y-4">
          {[...Array(5)].map((_, rowIdx) => (
            <div
              key={rowIdx}
              className="grid grid-cols-4 gap-4 items-center"
            >
              {[...Array(4)].map((_, colIdx) => (
                <Skeleton key={colIdx} className="h-6 w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
    )

  if (error)
    return (
      <div className="mt-16 container mx-auto py-10 text-red-500">
        Error fetching desa: {error}
      </div>
    )

  return (
    <div className="mt-16 container mx-auto py-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-black">Daftar Desa</h1>
        <Link href="/admin/desa/new" passHref>
          <button className="mr-8 inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded-md">
            <Plus className="h-4 w-4" />
            Buat Desa Baru
          </button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
