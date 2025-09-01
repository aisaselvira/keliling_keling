"use client"

import * as React from "react"
import { columns, Article } from "@/app/components/Admin/Article/Columns"
import { DataTable } from "@/app/components/Admin/DataTable"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

type SortOrder = "newest" | "oldest"

export default function ArticleListPage() {
  const [allData, setAllData] = React.useState<Article[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [search, setSearch] = React.useState("")
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("newest")
  const [debouncedSearch, setDebouncedSearch] = React.useState(search)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  React.useEffect(() => {
    const t = window.setTimeout(
      () => setDebouncedSearch(search.trim().toLowerCase()),
      300
    )
    return () => window.clearTimeout(t)
  }, [search])

  React.useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        setError(null)
        if (!baseUrl) throw new Error("BASE_URL not configured")

        const res = await fetch(`${baseUrl}/api/article/admin`, {
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        })

        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const raw = await res.json()

        const mapped: Article[] = Array.isArray(raw)
          ? raw.map((a: any) => ({
              id: String(a.article_id),
              title: a.title,
              author: a.writer,
              status:
                a.status?.toLowerCase() === "terpublikasi"
                  ? "published"
                  : (a.status?.toLowerCase() as Article["status"]),
              publishedAt: a.timestamp,
              location: a.location || "—",
              photo: a.photo || null,
            }))
          : []

        setAllData(mapped)
      } catch (e: any) {
        setError(e?.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [baseUrl])

  const data = React.useMemo(() => {
    let filtered = allData

    if (debouncedSearch) {
      filtered = filtered.filter((it) =>
        it.title.toLowerCase().includes(debouncedSearch)
      )
    }

    const sorted = [...filtered].sort((a, b) => {
      const ta = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
      const tb = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
      return sortOrder === "newest" ? tb - ta : ta - tb
    })

    return sorted
  }, [allData, debouncedSearch, sortOrder])

  if (loading)
    return (
      <div className="mt-16 container mx-auto py-10">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-8 w-[150px]" />
          </div>
          <Skeleton className="h-10 w-48" />
        </div>

        {/* Table Skeleton (rows only) */}
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
          ))}
        </div>
      </div>
    )

  if (error)
    return (
      <div className="flex-1 overflow-x-auto px-4 py-6">
        <div className="max-w-full lg:max-w-[1200px] mx-auto">
          <div className="p-6 text-red-500">
            Error fetching articles: {error}
          </div>
        </div>
      </div>
    )

  return (
    <div className="mt-16 container mx-auto py-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Kiri: Judul + Input + Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <input
            placeholder="Cari judul..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm w-full sm:w-[200px]"
            aria-label="Cari judul"
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="border px-3 py-2 rounded-md text-sm w-full sm:w-[150px]"
            aria-label="Urutkan"
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
          </select>
        </div>

        {/* Kanan: Tombol */}
        <Link href="/admin/article/new">
          <button className="mr-8 inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded-md whitespace-nowrap">
            <Plus className="h-4 w-4" />
            Buat Artikel Baru
          </button>
        </Link>
      </div>

      {/* Data Table */}
      {data.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          Tidak ada artikel yang tersedia.
        </div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  )
}
