"use client"

import * as React from "react"
import { columns, Article } from "@/app/components/Admin/Article/Columns"
import { DataTable } from "@/app/components/Admin/DataTable"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton" // ✅ import skeleton

type SortOrder = "newest" | "oldest"

export default function ArticleListPage() {
  const [allData, setAllData] = React.useState<Article[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [search, setSearch] = React.useState("")
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("newest")
  const [debouncedSearch, setDebouncedSearch] = React.useState(search)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  // debounce search
  React.useEffect(() => {
    const t = window.setTimeout(
      () => setDebouncedSearch(search.trim().toLowerCase()),
      300
    )
    return () => window.clearTimeout(t)
  }, [search])

  // fetch once
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

  // filtered + sorted
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
      if (sortOrder === "newest") return tb - ta
      return ta - tb
    })

    return sorted
  }, [allData, debouncedSearch, sortOrder])

  // ✅ Loading skeleton UI
  if (loading)
    return (
      <div className="flex-1 overflow-x-auto px-4 py-6">
        <div className="max-w-full lg:max-w-[1200px] mx-auto space-y-4">
          {/* Header Skeleton */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-40" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-[200px]" />
                <Skeleton className="h-8 w-[150px]" />
              </div>
            </div>
            <Skeleton className="h-8 w-36" />
          </div>

          {/* Table Skeleton (5 baris x 5 kolom) */}
          <div className="border rounded-md overflow-x-auto">
            <div className="min-w-[600px] space-y-2 p-4">
              {[...Array(5)].map((_, rowIdx) => (
                <div
                  key={rowIdx}
                  className="grid grid-cols-5 gap-4 items-center"
                >
                  {[...Array(5)].map((_, colIdx) => (
                    <Skeleton key={colIdx} className="h-6 w-full" />
                  ))}
                </div>
              ))}
            </div>
          </div>
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

  // ✅ Final Content
  return (
    <div className="flex-1 overflow-x-auto px-4 py-6">
      <div className="max-w-full lg:max-w-[1200px] mx-auto">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold text-black">Daftar Artikel</h1>
            <div className="flex flex-wrap gap-2 mt-2 items-center">
              <input
                placeholder="Cari judul..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border px-3 py-2 rounded-md text-sm w-full sm:w-[200px]"
                aria-label="Cari judul"
              />
              <select
                value={sortOrder}
                onChange={(e) =>
                  setSortOrder(e.target.value as SortOrder)
                }
                className="border px-3 py-2 rounded-md text-sm w-full sm:w-[150px]"
                aria-label="Urutkan"
              >
                <option value="newest">Terbaru dulu</option>
                <option value="oldest">Terlama dulu</option>
              </select>
            </div>
          </div>
          <div className="flex-shrink">
            <Link href="/admin/article/new">
              <button className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
                <Plus size={16} />
                Buat Artikel Baru
              </button>
            </Link>
          </div>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto border rounded-md">
          <div className="min-w-[600px]">
            <DataTable columns={columns} data={data} />
          </div>
        </div>
      </div>
    </div>
  )
}
