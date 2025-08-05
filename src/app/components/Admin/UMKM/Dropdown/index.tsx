// components/Admin/UMKM/VillageDropdown.tsx
"use client"

import * as React from "react"

export type UMKMItem = {
  business_id: string
  business_name: string
  created_by_name?: string
  category_name?: string
  village_name?: string
  owner?: string
  created_at?: string
  location_name?: string
  photos?: string[]
  price?: string
}

type Props = {
  placeholder?: string
  onFilter: (results: UMKMItem[], selectedVillage: string) => void
}

export default function VillageDropdown({ placeholder = "Pilih desa", onFilter }: Props) {
  const [villageList, setVillageList] = React.useState<string[]>([])
  const [selected, setSelected] = React.useState<string>("")
  const [loading, setLoading] = React.useState<boolean>(false)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL 

  const mapRaw = (a: any): UMKMItem => ({
    business_id: a.business_id,
    business_name: a.business_name,
    created_by_name: a.created_by_name,
    category_name: a.category_name,
    village_name: a.village_name,
    owner: a.owner,
    created_at: a.created_at,
    location_name: a.location_name,
    photos: Array.isArray(a.photos) ? a.photos : [],
    price: a.price,
  })

  // load all UMKM to derive village options on mount
  React.useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/umkm`, {
          cache: "no-store",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const raw = await res.json()
        const list: UMKMItem[] = Array.isArray(raw) ? raw.map(mapRaw) : []
        const uniq = Array.from(
          new Set(list.map((u) => u.village_name || "").filter(Boolean))
        ).sort()
        setVillageList(uniq)
        // initial: no filter => send full list
        onFilter(list, "")
      } catch (e) {
        console.error("Failed to init village dropdown", e)
        onFilter([], "")
      }
    }
    fetchAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseUrl])

  const handleChange = async (v: string) => {
    setSelected(v)
    setLoading(true)
    try {
      const url =
        v && v.trim()
          ? `${baseUrl}/api/umkm/search?village=${encodeURIComponent(v.trim())}`
          : `${baseUrl}/api/umkm`
      const res = await fetch(url, {
        cache: "no-store",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const raw = await res.json()
      const list: UMKMItem[] = Array.isArray(raw) ? raw.map(mapRaw) : []
      onFilter(list, v)
    } catch (e) {
      console.error("Filter fetch error", e)
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
        onChange={(e) => handleChange(e.target.value)}
        className="border px-3 py-2 rounded-md shadow-sm bg-white"
        disabled={villageList.length === 0}
      >
        <option value="">{placeholder}</option>
        {villageList.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
      {loading && <div className="text-xs italic">Memuat...</div>}
    </div>
  )
}
