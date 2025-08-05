"use client"

import { useState, useEffect, ChangeEvent, useMemo } from "react"
import { useRouter } from "next/navigation"
import imageCompression from "browser-image-compression"
import UmkmEditor from "@/app/components/Admin/UMKM/UMKMEditor"
import { Button } from "@/components/ui/button"

type UmkmPayload = {
  location_name: string
  address: string
  business_name: string
  description: string
  category_id: string | number
  village_id: string
  price: string
  owner: string
  photos: string[]
  link: string
  business_telephone: string
}

export default function NewUmkmPage() {
  const router = useRouter()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL 

  const [businessName, setBusinessName] = useState("")
  const [description, setDescription] = useState("")
  const [address, setAddress] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [villageId, setVillageId] = useState("")
  const [price, setPrice] = useState("")
  const [owner, setOwner] = useState("")
  const [link, setLink] = useState("")
  const [business_telephone, setBusinessTelephone] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [categories, setCategories] = useState<
    { category_id: number; category_name: string }[]
  >([])
  const [villages, setVillages] = useState<
    { village_id: number; village_name: string }[]
  >([])

  // location_name otomatis: "lokasi {businessName}, {address}"
  const locationName = useMemo(() => {
    let name = `lokasi ${businessName || ""}`
    if (address) name += `, ${address}`
    name = name.trim().replace(/\s+/g, " ")
    if (name.length > 100) name = name.slice(0, 100)
    return name
  }, [businessName, address])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, vilRes] = await Promise.all([
          fetch(`${baseUrl}/api/category`, { credentials: "include" }),
          fetch(`${baseUrl}/api/village`, { credentials: "include" }),
        ])
        if (!catRes.ok || !vilRes.ok) {
          console.warn("Fetch kategori/desa error", catRes.status, vilRes.status)
        }
        const [catData, vilData] = await Promise.all([
          catRes.json(),
          vilRes.json(),
        ])
        setCategories(Array.isArray(catData) ? catData : [])
        setVillages(Array.isArray(vilData) ? vilData : [])
        if (Array.isArray(catData) && catData[0]) {
          setCategoryId(String(catData[0].category_id))
        }
        if (Array.isArray(vilData) && vilData[0]) {
          setVillageId(String(vilData[0].village_id))
        }
      } catch (err) {
        console.error("Gagal fetch kategori atau desa", err)
      }
    }
    fetchData()
  }, [baseUrl])

  useEffect(() => {
    const urls = images.map((f) => URL.createObjectURL(f))
    setPreviews(urls)
    return () => urls.forEach((u) => URL.revokeObjectURL(u))
  }, [images])

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + images.length > 3) {
      alert("Maksimum 3 gambar")
      return
    }
    setImages((prev) => [...prev, ...files])
  }

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  const validate = (): string | null => {
    if (!businessName.trim()) return "Nama UMKM wajib diisi"
    if (!description.trim()) return "Deskripsi wajib diisi"
    if (!address.trim()) return "Alamat lengkap wajib diisi"
    if (!categoryId.toString().trim()) return "Kategori wajib diisi"
    if (!villageId.trim()) return "Nama desa wajib dipilih"
    if (!price.trim()) return "Harga wajib diisi"
    if (!owner.trim()) return "Pemilik wajib diisi"
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

          const uploadRes = await fetch(`${baseUrl}/api/umkm/upload`, {
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

      const payload: UmkmPayload = {
        location_name: locationName,
        address,
        business_name: businessName,
        description,
        category_id: categoryId,
        village_id: villageId,
        price,
        owner,
        photos: photoUrls,
        link,
        business_telephone,
      }

      const res = await fetch(`${baseUrl}/api/umkm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || "Gagal menyimpan UMKM")
      }

      alert("UMKM berhasil dibuat")
      router.push("/admin/umkm")
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
      <h1 className="text-2xl font-bold text-black">Tambah UMKM Baru</h1>

      {error && (
        <div className="text-red-600 bg-red-100 px-4 py-2 rounded">{error}</div>
      )}

      <div className="flex flex-col space-y-1">
        <label className="font-semibold">Nama UMKM</label>
        <input
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="border px-4 py-2 rounded-md shadow-sm"
          placeholder="Nama UMKM"
        />
      </div>

      <div className="flex flex-col space-y-1">
        <label className="font-semibold">Deskripsi</label>
        <UmkmEditor value={description} onChange={setDescription} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-1">
          <label className="font-semibold">Alamat Lengkap</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border px-4 py-2 rounded-md shadow-sm"
            placeholder="Alamat lengkap"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label className="font-semibold">Nama Desa</label>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-1">
          <label className="font-semibold">Kategori</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="border px-4 py-2 rounded-md shadow-sm"
          >
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.category_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="font-semibold">Harga</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border px-4 py-2 rounded-md shadow-sm"
            placeholder="Harga"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label className="font-semibold">Pemilik</label>
          <input
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="border px-4 py-2 rounded-md shadow-sm"
            placeholder="Nama pemilik"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label className="font-semibold">Link</label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="border px-4 py-2 rounded-md shadow-sm"
            placeholder="Link"
          />
        </div>
      </div>

      <div className="flex flex-col space-y-1">
        {/* no. telepon */}
    <div className="flex flex-col space-y-1 flex-1 min-w-[200px]">
      <label className="font-semibold">No. Telepon</label>
      <input
        type="text"
        value={business_telephone}
        onChange={(e) => setBusinessTelephone(e.target.value)}
        className="border px-4 py-2 rounded-md shadow-sm"
        placeholder="08xxxxxxxxxx"
      />
    </div>
        <label className="font-semibold">Foto UMKM (maks 3)</label>
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
                className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs"
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
          className="bg-green-600"
        >
          {submitting ? "Menyimpan..." : "Simpan UMKM"}
        </Button>
      </div>
    </div>
  )
}
