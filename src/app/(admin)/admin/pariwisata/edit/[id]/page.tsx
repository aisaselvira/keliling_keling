"use client"

import { useState, useEffect, ChangeEvent, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import imageCompression from "browser-image-compression"
import UmkmEditor from "@/app/components/Admin/UMKM/UMKMEditor" // kalau ada editor khusus pariwisata, ganti nama import
import { Button } from "@/components/ui/button"

type PhotoObj = {
  url: string
  public_id?: string
}

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
}

export default function EditPariwisataPage() {
  const router = useRouter()
  const { id: tourism_id } = useParams() as { id?: string }
  const isEdit = Boolean(tourism_id)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const [tourismName, setTourismName] = useState("")
  const [description, setDescription] = useState("")
  const [address, setAddress] = useState("")
  const [villageId, setVillageId] = useState("")
  const [facility, setFacility] = useState("")
  const [ticket_fee, setTicketFee] = useState<number | "">("")
  const [link, setLink] = useState("")
  const [createdBy, setCreatedBy] = useState<string>("")

  const [existingPhotos, setExistingPhotos] = useState<PhotoObj[]>([])
  const [replacementFiles, setReplacementFiles] = useState<(File | null)[]>([])
  const [replacementPreviews, setReplacementPreviews] = useState<string[]>([])
  const [newImages, setNewImages] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])

  const [villages, setVillages] = useState<{ village_id: number; village_name: string }[]>([])

  const [uploadingImages, setUploadingImages] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const locationName = useMemo(() => {
    let name = `lokasi ${tourismName || ""}`
    if (address) name += `, ${address}`
    name = name.trim().replace(/\s+/g, " ")
    if (name.length > 100) name = name.slice(0, 100)
    return name
  }, [tourismName, address])

  // ambil user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/user/me`, { credentials: "include" })
        if (!res.ok) return
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
        // hanya set default kalau belum ada villageId (tidak overwrite saat edit setelah data pariwisata datang)
        setVillageId((prev) => prev || (list[0] ? String(list[0].village_id) : ""))
      } catch (e) {
        console.error("Gagal fetch desa", e)
      }
    }
    fetchVillages()
  }, [baseUrl])
  

  // fetch existing pariwisata
  useEffect(() => {
    if (!isEdit || !tourism_id) return
    const fetchTourism = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/tourism/${tourism_id}`, {
          credentials: "include",
        })
        if (!res.ok) throw new Error("Gagal memuat data pariwisata")
        const data = await res.json()

        setTourismName(data.tourism_name || "")
        setDescription(data.description || "")
        setAddress(data.address || "")
        setFacility(data.facility || "")
        setTicketFee(data.ticket_fee ?? "")
        setLink(data.link || "")
        setVillageId(String(data.village_id || ""))
        if (data.created_by) setCreatedBy(data.created_by)

        const photos: PhotoObj[] = Array.isArray(data.photos)
          ? data.photos.map((p: any) =>
              typeof p === "string" ? { url: p } : { url: p.url, public_id: p.public_id }
            )
          : []
        setExistingPhotos(photos)
        setReplacementFiles(new Array(photos.length).fill(null))
        setReplacementPreviews(new Array(photos.length).fill(""))
      } catch (e: any) {
        console.error("Error fetch pariwisata", e)
        setError("Gagal mengambil data pariwisata untuk diedit")
      }
    }
    fetchTourism()
  }, [isEdit, tourism_id, baseUrl])

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
    if (files.length + totalCount > 5) {
      alert("Maksimum 5 gambar termasuk yang sudah ada")
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
    if (!tourismName.trim()) return "Nama Pariwisata wajib diisi"
    if (!description.trim()) return "Deskripsi wajib diisi"
    if (!address.trim()) return "Alamat lengkap wajib diisi"
    if (!villageId.trim()) return "Nama desa wajib dipilih"
    if (ticket_fee === "" || ticket_fee === null || Number.isNaN(Number(ticket_fee)))
      return "Harga tiket wajib diisi dengan angka"
    if (!createdBy) return "User tidak terdeteksi"
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
      let photoUrls: string[] = []

      // replace existing photos
      for (let i = 0; i < existingPhotos.length; i++) {
        const existing = existingPhotos[i]
        const replacementFile = replacementFiles[i]
        if (replacementFile) {
          if (existing.public_id) {
            try {
              const delRes = await fetch(`${baseUrl}/api/tourism/upload`, {
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
          const uploadRes = await fetch(`${baseUrl}/api/tourism/upload`, {
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

      // upload new images
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
          const uploadRes = await fetch(`${baseUrl}/api/tourism/upload`, {
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
      }

      const res = await fetch(`${baseUrl}/api/tourism/${tourism_id}`, {
        method: "PUT",
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

      alert("Pariwisata berhasil diperbarui")
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
      <h1 className="text-2xl font-bold text-black">{isEdit ? "Edit Pariwisata" : "Tambah Pariwisata Baru"}</h1>

      {error && (
        <div className="text-red-600 bg-red-100 px-4 py-2 rounded">{error}</div>
      )}

      <div className="flex flex-col space-y-1">
        <label className="font-semibold">Nama Pariwisata</label>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col space-y-1">
          <label className="font-semibold">Fasilitas</label>
          <input
            type="text"
            value={facility}
            onChange={(e) => setFacility(e.target.value)}
            className="border px-4 py-2 rounded-md shadow-sm"
            placeholder="Contoh: Parkir, Toilet"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label className="font-semibold">Harga Tiket</label>
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
          <label className="font-semibold">Link</label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="border px-4 py-2 rounded-md shadow-sm"
            placeholder="Website atau tiket"
          />
        </div>
      </div>

      <div className="flex flex-col space-y-1">
        <label className="font-semibold">Foto Pariwisata (maks 5)</label>
        <div className="flex gap-3 flex-wrap">
          {existingPhotos.map((photo, i) => (
            <div key={`exist-${i}`} className="flex flex-col border rounded p-2 relative">
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
                className="absolute -top-1 -right-1 bg-orange-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs"
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
          {submitting ? "Menyimpan..." : isEdit ? "Update Pariwisata" : "Simpan Pariwisata"}
        </Button>
      </div>
    </div>
  )
}
