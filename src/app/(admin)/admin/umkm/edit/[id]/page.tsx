"use client"

import { useState, useEffect, ChangeEvent, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import imageCompression from "browser-image-compression"
import UmkmEditor from "@/app/components/Admin/UMKM/UMKMEditor"
import { Button } from "@/components/ui/button"

type PhotoObj = {
  url: string
  public_id?: string
}

type UmkmPayload = {
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

export default function EditUmkmPage() {
  const router = useRouter()
  const { id: businessId } = useParams() as { id?: string }
  const isEdit = Boolean(businessId)
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

  const [existingPhotos, setExistingPhotos] = useState<PhotoObj[]>([])
  const [replacementFiles, setReplacementFiles] = useState<(File | null)[]>([])
  const [replacementPreviews, setReplacementPreviews] = useState<string[]>([])
  const [newImages, setNewImages] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])

  const [categories, setCategories] = useState<{ category_id: number; category_name: string }[]>([])
  const [villages, setVillages] = useState<{ village_id: number; village_name: string }[]>([])

  const [uploadingImages, setUploadingImages] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // location_name otomatis
//   const locationName = useMemo(() => {
//     let name = `lokasi ${businessName || ""}`
//     if (address) name += `, ${address}`
//     name = name.trim().replace(/\s+/g, " ")
//     if (name.length > 100) name = name.slice(0, 100)
//     return name
//   }, [businessName, address])

  // fetch kategori + desa
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, vilRes] = await Promise.all([
          fetch(`${baseUrl}/api/category`, { credentials: "include" }),
          fetch(`${baseUrl}/api/village`, { credentials: "include" }),
        ])
        const [catData, vilData] = await Promise.all([catRes.json(), vilRes.json()])
        setCategories(Array.isArray(catData) ? catData : [])
        setVillages(Array.isArray(vilData) ? vilData : [])
        if (Array.isArray(catData) && catData[0] && !categoryId) {
          setCategoryId(String(catData[0].category_id))
        }
        if (Array.isArray(vilData) && vilData[0] && !villageId) {
          setVillageId(String(vilData[0].village_id))
        }
      } catch (e) {
        console.error("Gagal fetch kategori/desa", e)
      }
    }
    fetchData()
  }, [baseUrl])

  // fetch existing UMKM
  useEffect(() => {
    if (!isEdit) return
    const fetchUmkm = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/umkm/${businessId}`, {
          credentials: "include",
        })
        if (!res.ok) throw new Error("Gagal ambil data UMKM")
        const data = await res.json()
        setBusinessName(data.business_name || "")
        setDescription(data.description || "")
        setAddress(data.address || "")
        setCategoryId(String(data.category_id || ""))
        setVillageId(String(data.village_id || ""))
        setPrice(data.price || "")
        setOwner(data.owner || "")
        setLink(data.link || "")
        setBusinessTelephone(data.business_telephone || "")

        const photos: PhotoObj[] = Array.isArray(data.photos)
          ? data.photos.map((p: any) =>
              typeof p === "string" ? { url: p } : { url: p.url, public_id: p.public_id }
            )
          : []
        setExistingPhotos(photos)
        setReplacementFiles(new Array(photos.length).fill(null))
        setReplacementPreviews(new Array(photos.length).fill(""))
      } catch (e) {
        console.error("Error fetch UMKM", e)
        setError("Gagal mengambil data UMKM untuk diedit")
      }
    }
    fetchUmkm()
  }, [isEdit, businessId, baseUrl])

  // previews for replacement and new
  useEffect(() => {
    const urls = replacementFiles.map((f) => (f ? URL.createObjectURL(f) : ""))
    setReplacementPreviews(urls)
    return () => urls.forEach((u) => u && URL.revokeObjectURL(u))
  }, [replacementFiles])

  useEffect(() => {
    const urls = newImages.map((f) => URL.createObjectURL(f))
    setNewPreviews(urls)
    return () => urls.forEach((u) => URL.revokeObjectURL(u))
  }, [newImages])

  const handleReplaceExisting = (idx: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setReplacementFiles((prev) => {
      const copy = [...prev]
      copy[idx] = file
      return copy
    })
  }

  const handleAddNewImages = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const totalCount = existingPhotos.length + newImages.length
    if (files.length + totalCount > 3) {
      alert("Maksimum 3 gambar termasuk yang sudah ada")
      return
    }
    setNewImages((prev) => [...prev, ...files])
  }

  const removeExisting = (idx: number) => {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== idx))
    setReplacementFiles((prev) => {
      const copy = [...prev]
      copy.splice(idx, 1)
      return copy
    })
    setReplacementPreviews((prev) => {
      const copy = [...prev]
      copy.splice(idx, 1)
      return copy
    })
  }

  const removeNew = (idx: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== idx))
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
    const vErr = validate()
    if (vErr) {
      setError(vErr)
      return
    }
    setSubmitting(true)
    try {
      let photoUrls: string[] = []

      // replacement logic
      for (let i = 0; i < existingPhotos.length; i++) {
        const existing = existingPhotos[i]
        const replacementFile = replacementFiles[i]
        if (replacementFile) {
          if (existing.public_id) {
            try {
              const delRes = await fetch(`${baseUrl}/api/umkm/upload`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ public_id: existing.public_id }),
                credentials: "include",
              })
              if (!delRes.ok) {
                console.warn("Gagal hapus gambar lama", await delRes.text())
              }
            } catch (e) {
              console.warn("Error delete existing image", e)
            }
          }
          const compressed = await imageCompression(replacementFile, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1280,
            useWebWorker: true,
          })
          const fd = new FormData()
          fd.append("images", compressed)
          const uploadRes = await fetch(`${baseUrl}/api/umkm/upload`, {
            method: "POST",
            credentials: "include",
            body: fd,
          })
          if (!uploadRes.ok) {
            const txt = await uploadRes.text()
            throw new Error(`Gagal upload pengganti: ${txt}`)
          }
          const uploadData = await uploadRes.json()
          if (Array.isArray(uploadData.images)) {
            const first = uploadData.images.find((imgObj: any) => imgObj.url)
            if (first && first.url) photoUrls.push(first.url)
          }
        } else {
          photoUrls.push(existing.url)
        }
      }

      // upload new ones
      if (newImages.length) {
        setUploadingImages(true)
        for (const img of newImages) {
          const compressed = await imageCompression(img, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1280,
            useWebWorker: true,
          })
          const fd = new FormData()
          fd.append("images", compressed)
          const uploadRes = await fetch(`${baseUrl}/api/umkm/upload`, {
            method: "POST",
            credentials: "include",
            body: fd,
          })
          if (!uploadRes.ok) {
            const txt = await uploadRes.text()
            throw new Error(`Gagal upload gambar baru: ${txt}`)
          }
          const uploadData = await uploadRes.json()
          if (Array.isArray(uploadData.images)) {
            uploadData.images.forEach((imgObj: any) => {
              if (imgObj.url) photoUrls.push(imgObj.url)
            })
          }
        }
        setUploadingImages(false)
      }

      const payload: UmkmPayload = {
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

      const res = await fetch(
        isEdit ? `${baseUrl}/api/umkm/${businessId}` : `${baseUrl}/api/umkm`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      )
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || "Gagal menyimpan UMKM")
      }

      alert(isEdit ? "UMKM berhasil diperbarui" : "UMKM berhasil dibuat")
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
    <div className="space-y-6 max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold">{isEdit ? "Edit UMKM" : "Tambah UMKM Baru"}</h1>

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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <label className="font-semibold">No. Telepon</label>
        <input
          type="text"
          value={business_telephone}
          onChange={(e) => setBusinessTelephone(e.target.value)}
          className="border px-4 py-2 rounded-md shadow-sm"
          placeholder="08xxxxxxxxxx"
        />
      </div>

      <div className="flex flex-col space-y-1">
        <label className="font-semibold">Foto UMKM (maks 3)</label>
        <div className="flex gap-3 flex-wrap">
          {existingPhotos.map((photo, i) => (
            <div key={`exist-${i}`} className="flex flex-col border rounded p-2">
              <img
                src={replacementPreviews[i] || photo.url}
                alt={`foto ${i}`}
                className="h-24 w-24 object-cover rounded"
              />
              <div className="flex gap-2 mt-1">
                <label className="text-xs cursor-pointer border px-2 py-1 rounded bg-white shadow-sm">
                  Ganti
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleReplaceExisting(i, e)}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeExisting(i)}
                  className="text-xs bg-red-600 text-white rounded px-2 py-1"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}

          {newPreviews.map((src, i) => (
            <div key={`new-${i}`} className="relative border rounded p-2">
              <img
                src={src}
                alt={`new ${i}`}
                className="h-24 w-24 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => removeNew(i)}
                className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="mt-2">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleAddNewImages}
            className="file:border file:px-4 py-2 rounded-md"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={handleSubmit}
          disabled={uploadingImages || submitting}
          className="bg-orange-600"
        >
          {submitting ? "Menyimpan..." : isEdit ? "Update UMKM" : "Simpan UMKM"}
        </Button>
      </div>
    </div>
  )
}
