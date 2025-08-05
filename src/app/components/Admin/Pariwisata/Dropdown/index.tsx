// app/components/Admin/Pariwisata/VillageDropdown.tsx
"use client"

import * as React from "react"

export type PariwisataItem = {
  tourism_id: string
  tourism_name: string
  created_by_name?: string
  village_name?: string
  created_at?: string
  location_name?: string
  photos?: string[]
}

type Props = {
  placeholder?: string
  onFilter: (filtered: PariwisataItem[], selectedVillage: string) => void
}

export default function VillageDropdown({ placeholder = "Semua desa", onFilter }: Props) {
  const [villages, setVillages] = React.useState<string[]>([])
  const [selected, setSelected] = React.useState<string>("")
  const [loading, setLoading] = React.useState(false)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  // load all tourism to extract unique villages once
  React.useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${baseUrl}/api/tourism`, {
          credentials: "include",
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const raw = await res.json()
        const names = Array.isArray(raw)
          ? Array.from(new Set(raw.map((r: any) => r.village_name).filter(Boolean)))
          : []
        setVillages(names)
        // initial unfiltered callback with full list
        onFilter(
          Array.isArray(raw)
            ? raw.map((a: any) => ({
                tourism_id: a.tourism_id,
                tourism_name: a.tourism_name,
                created_by_name: a.created_by_name,
                village_name: a.village_name,
                created_at: a.created_at,
                location_name: a.location_name,
                photos: Array.isArray(a.photos) ? a.photos : [],
              }))
            : [],
          ""
        )
      } catch (e) {
        console.error("VillageDropdown fetchAll error", e)
        onFilter([], "")
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [baseUrl, onFilter])

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value
    setSelected(v)
    setLoading(true)
    try {
      const url =
        v && v.trim()
          ? `${baseUrl}/api/tourism/search?village=${encodeURIComponent(v.trim())}`
          : `${baseUrl}/api/tourism`
      const res = await fetch(url, {
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const raw = await res.json()
      const list: PariwisataItem[] = Array.isArray(raw)
        ? raw.map((a: any) => ({
            tourism_id: a.tourism_id,
            tourism_name: a.tourism_name,
            created_by_name: a.created_by_name,
            village_name: a.village_name,
            created_at: a.created_at,
            location_name: a.location_name,
            photos: Array.isArray(a.photos) ? a.photos : [],
          }))
        : []
      onFilter(list, v)
    } catch (e) {
      console.error("VillageDropdown filter error", e)
      onFilter([], v)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        aria-label="Filter desa"
        value={selected}
        onChange={handleChange}
        className="border px-3 py-2 rounded-md shadow-sm bg-white"
      >
        <option value="">{placeholder}</option>
        {villages.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
      {loading && <div className="text-xs italic">Memuat...</div>}
    </div>
  )
}
