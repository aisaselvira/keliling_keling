"use client"

import { useState, useEffect, ChangeEvent, useMemo } from "react"
import { useRouter } from "next/navigation"
import imageCompression from "browser-image-compression"
import UmkmEditor from "@/app/components/Admin/UMKM/UMKMEditor"
import { Button } from "@/components/ui/button"

type PariwisataPayload = {
  location_name: string
  address: string
  tourism_name: string
  description: string
  facility: string | number
  village_id: string
  ticket_fee: number
  created_by: string
  photos: string[]
  link: string
  telephone: string
}

export default function NewPariwisataPage() {
  const router = useRouter()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const [tourismName, setTourismName] = useState("")
  const [description, setDescription] = useState("")
  const [address, setAddress] = useState("")
  const [villageId, setVillageId] = useState("")
  const [facility, setFacility] = useState("")
  const [telephone, setTelephone] = useState("")
  const [ticket_fee, setTicketFee] = useState<number | "">("")
  const [link, setLink] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdBy, setCreatedBy] = useState<string>("")

  const [villages, setVillages] = useState<{ village_id: number; village_name: string }[]>([])

  // location_name otomatis: "lokasi {tourismName}, {address}"
  const locationName = useMemo(() => {
    let name = `lokasi ${tourismName || ""}`
    if (address) name += `, ${address}`
    name = name.trim().replace(/\s+/g, " ")
    if (name.length > 100) name = name.slice(0, 100)
    return name
  }, [tourismName, address])

  // ambil user untuk created_by
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/user/me`, { credentials: "include" })
        if (!res.ok) throw new Error("Gagal mengambil user")
        const u = await res.json()
        if (u.user_id) setCreatedBy(u.user_id)
      } catch (e) {
        console.warn("fetch user failed", e)
      }
    }
    fetchUser()
  }, [baseUrl])

  // fetch desa
  useEffect(() => {
    const fetchVillages = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/village`, { credentials: "include" })
        if (!res.ok) throw new Error("Gagal fetch desa")
        const data = await res.json()
        const list = Array.isArray(data) ? data : []
        setVillages(list)
        if (list[0]) setVillageId(String(list[0].village_id))
      } catch (err) {
        console.error("Gagal fetch desa", err)
      }
    }
    fetchVillages()
  }, [baseUrl])

  // preview images
  useEffect(() => {
    const urls = images.map((f) => URL.createObjectURL(f))
    setPreviews(urls)
    return () => urls.forEach((u) => URL.revokeObjectURL(u))
  }, [images])

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + images.length > 5) {
      alert("Maksimum 5 gambar")
      return
    }
    setImages((prev) => [...prev, ...files])
  }

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  const validate = (): string | null => {
    if (!tourismName.trim()) return "Nama Pariwisata wajib diisi"
    if (!description.trim()) return "Deskripsi wajib diisi"
    if (!address.trim()) return "Alamat lengkap wajib diisi"
    if (!villageId.trim()) return "Nama desa wajib dipilih"
    if (ticket_fee === "" || ticket_fee === null || Number.isNaN(Number(ticket_fee)))
      return "Harga tiket wajib diisi dengan angka"
    if (!createdBy) return "User tidak terdeteksi"
    if (!telephone) return "Nomor telephone wajib diisi"
    return null
  }

  const handleSubmit = async () => {
    setError(null)
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)
    try {
      const photoUrls: string[] = []
      if (images.length) {
        setUploadingImages(true)
        for (const img of images) {
          const compressed = await imageCompression(img, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1280,
            useWebWorker: true,
          })
          const formData = new FormData()
          formData.append("images", compressed)

          const uploadRes = await fetch(`${baseUrl}/api/tourism/upload`, {
            method: "POST",
            credentials: "include",
            body: formData,
          })
          if (!uploadRes.ok) {
            const txt = await uploadRes.text()
            throw new Error(`Gagal upload gambar: ${txt}`)
          }
          const uploadData = await uploadRes.json()
          if (!uploadData.images || !Array.isArray(uploadData.images)) {
            throw new Error("Response upload tidak berisi array images")
          }
          uploadData.images.forEach((imgObj: { url?: string }) => {
            if (imgObj.url) photoUrls.push(imgObj.url)
          })
        }
        setUploadingImages(false)
      }

      const payload: PariwisataPayload = {
        location_name: locationName,
        address,
        tourism_name: tourismName,
        description,
        facility: facility || "",
        village_id: villageId,
        ticket_fee: Number(ticket_fee),
        created_by: createdBy,
        photos: photoUrls,
        link,
        telephone
      }

      const res = await fetch(`${baseUrl}/api/tourism`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || "Gagal menyimpan pariwisata")
      }

      alert("Pariwisata berhasil dibuat")
      router.push("/admin/pariwisata")
    } catch (e: any) {
      console.error(e)
      setError(e.message || "Terjadi kesalahan")
    } finally {
      setUploadingImages(false)
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-10">
      <h1 className="text-2xl font-bold text-black">Tambah Pariwisata Baru</h1>

      {error && (
        <div className="text-red-600 bg-red-100 px-4 py-2 rounded">{error}</div>
      )}

      <div className="flex flex-col space-y-1">
        <label className="font-semibold">Nama Pariwisata<span className="text-red-600">*</span> </label>
        <input
          type="text"
          value={tourismName}
          onChange={(e) => setTourismName(e.target.value)}
          className="border px-4 py-2 rounded-md shadow-sm"
          placeholder="Nama tempat pariwisata"
        />
      </div>

      <div className="flex flex-col space-y-1">
        <label className="font-semibold">Deskripsi</label>
        <UmkmEditor value={description} onChange={setDescription} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-1">
          <label className="font-semibold">Alamat Lengkap <span className="text-red-600">*</span>  </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border px-4 py-2 rounded-md shadow-sm"
            placeholder="Alamat lengkap"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label className="font-semibold">Nama Desa <span className="text-red-600">*</span> </label>
          <select
            value={villageId}
            onChange={(e) => setVillageId(e.target.value)}
            className="border px-4 py-2 rounded-md shadow-sm"
          >
            {villages.map((v) => (
              <option key={v.village_id} value={v.village_id}>
                {v.village_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col space-y-1">
          <label className="font-semibold">Fasilitas <span className="text-red-600">*</span> </label>
          <input
            type="text"
            value={facility}
            onChange={(e) => setFacility(e.target.value)}
            className="border px-4 py-2 rounded-md shadow-sm"
            placeholder="Contoh: Parkir, Toilet"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label className="font-semibold">Harga Tiket <span className="text-red-600">*</span> </label>
          <input
            type="number"
            value={ticket_fee}
            onChange={(e) => setTicketFee(e.target.value === "" ? "" : Number(e.target.value))}
            className="border px-4 py-2 rounded-md shadow-sm"
            placeholder="0"
            min={0}
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label className="font-semibold">Link <span className="text-red-600">*</span> </label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="border px-4 py-2 rounded-md shadow-sm"
            placeholder="Link google maps"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label className="font-semibold">Nomor telephone <span className="text-red-600">*</span> </label>
          <input
            type="text"
            value={(telephone)}
            onChange={(e) => setTelephone(e.target.value)}
            className="border px-4 py-2 rounded-md shadow-sm"
            placeholder="Nomor telephone pemilik"
          />
        </div>
      </div>

      <div className="flex flex-col space-y-1">
        <label className="font-semibold">Foto Pariwisata (maks 5) <span className="text-red-600">*</span> </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          className="file:border file:px-4 py-2 rounded-md"
        />
        <div className="flex gap-2 mt-2 flex-wrap">
          {previews.map((src, i) => (
            <div key={i} className="relative">
              <img
                src={src}
                alt={`preview ${i}`}
                className="h-24 w-24 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-1 -right-1 bg-orange-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={handleSubmit}
          disabled={uploadingImages || submitting}
          className="bg-orange-600"
        >
          {submitting ? "Menyimpan..." : "Simpan Pariwisata"}
        </Button>
      </div>
    </div>
  )
}
