"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

type VillagePayload = {
  address: string
  village_name: string
  district: string
  regency: string
  province: string
  postal_code: string
  description: string
  latitude?: number
  longitude?: number
}

export default function NewDesaPage() {
  const router = useRouter()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const [villageName, setVillageName] = useState("")
  const [district, setDistrict] = useState("")
  const [regency, setRegency] = useState("")
  const [province, setProvince] = useState("")
  const [address, setAddress] = useState("")
  const [description, setDescription] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [latitude, setLatitude] = useState<string>("")
  const [longitude, setLongitude] = useState<string>("")

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validate = (): string | null => {
    if (!villageName.trim()) return "Nama desa wajib diisi"
    if (!district.trim()) return "Kecamatan wajib diisi"
    if (!regency.trim()) return "Kabupaten/kota wajib diisi"
    if (!province.trim()) return "Provinsi wajib diisi"
    if (!address.trim()) return "Alamat wajib diisi"
    if (!description.trim()) return "Deskripsi wajib diisi"
    if (!postalCode.trim()) return "Kode pos wajib diisi"
    if (latitude && isNaN(Number(latitude))) return "Latitude harus berupa angka jika diisi"
    if (longitude && isNaN(Number(longitude))) return "Longitude harus berupa angka jika diisi"
    return null
  }

  const handleSubmit = async () => {
    setError(null)
    const vErr = validate()
    if (vErr) {
      setError(vErr)
      return
    }
    setSubmitting(true)
    try {
      const payload: VillagePayload = {
        village_name: villageName.trim(),
        district: district.trim(),
        regency: regency.trim(),
        province: province.trim(),
        address: address.trim(),
        description: description.trim(),
        postal_code: postalCode.trim(),
      }
      if (latitude) payload.latitude = Number(latitude)
      if (longitude) payload.longitude = Number(longitude)

      const res = await fetch(`${baseUrl}/api/village`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || "Gagal membuat desa")
      }

      alert("Desa berhasil dibuat")
      router.push("/admin/desa")
    } catch (e: any) {
      console.error(e)
      setError(e.message || "Terjadi kesalahan")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-10">
      <h1 className="text-2xl font-bold text-black">Tambah Desa Baru</h1>

      {error && (
        <div className="text-red-600 bg-red-100 px-4 py-2 rounded">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-1">
          <label className="font-semibold">Nama Desa</label>
          <input
            type="text"
            value={villageName}
            onChange={(e) => setVillageName(e.target.value)}
            className="border px-4 py-2 rounded-md shadow-sm"
            placeholder="Desa ..."
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label className="font-semibold">Kecamatan</label>
          <input
            type="text"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="border px-4 py-2 rounded-md shadow-sm"
            placeholder="Kecamatan ..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col space-y-1">
          <label className="font-semibold">Kabupaten/Kota</label>
          <input
            type="text"
            value={regency}
            onChange={(e) => setRegency(e.target.value)}
            className="border px-4 py-2 rounded-md shadow-sm"
            placeholder="Kabupaten ..."
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label className="font-semibold">Provinsi</label>
          <input
            type="text"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="border px-4 py-2 rounded-md shadow-sm"
            placeholder="Provinsi ..."
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label className="font-semibold">Kode Pos</label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="border px-4 py-2 rounded-md shadow-sm"
            placeholder="xxxxx"
          />
        </div>
      </div>

      <div className="flex flex-col space-y-1">
        <label className="font-semibold">Alamat</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border px-4 py-2 rounded-md shadow-sm"
          placeholder="Alamat lengkap desa"
        />
      </div>

      <div className="flex flex-col space-y-1">
        <label className="font-semibold">Deskripsi</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border px-4 py-2 rounded-md shadow-sm h-28"
          placeholder="Deskripsi singkat desa"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-1">
          <label className="font-semibold">Latitude (opsional)</label>
          <input
            type="text"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="border px-4 py-2 rounded-md shadow-sm"
            placeholder="-6.200000"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label className="font-semibold">Longitude (opsional)</label>
          <input
            type="text"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="border px-4 py-2 rounded-md shadow-sm"
            placeholder="106.816666"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button onClick={handleSubmit} disabled={submitting} className="bg-orange-600">
          {submitting ? "Menyimpan..." : "Simpan Desa"}
        </Button>
      </div>
    </div>
  )
}
