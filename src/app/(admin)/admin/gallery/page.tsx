"use client"
import { useEffect, useState, ChangeEvent, DragEvent } from "react"
import imageCompression from "browser-image-compression"

type Image = {
  public_id: string
  url: string
}

const MAX_SLOTS = 5
const MAX_BATCH_MB = 10

type Toast = {
  id: string
  type: "success" | "error"
  message: string
}

export default function Gallery() {
  const [images, setImages] = useState<Image[]>([])
  const [selectedFiles, setSelectedFiles] = useState<(File | null)[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const remainingSlots = MAX_SLOTS - images.length

  const fetchGallery = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/gallery/list`, { credentials: "include" })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(`Fetch gallery failed: ${t}`)
      }
      const data = await res.json()
      setImages(Array.isArray(data.images) ? data.images : [])
    } catch (e: any) {
      addToast("error", e.message || "Gagal mengambil gallery")
    }
  }

  useEffect(() => {
    fetchGallery()
  }, [])

  useEffect(() => {
    const urls = selectedFiles.map((f) => (f ? URL.createObjectURL(f) : ""))
    setPreviews(urls)
    return () => {
      urls.forEach((u) => u && URL.revokeObjectURL(u))
    }
  }, [selectedFiles])

  useEffect(() => {
    // Potong array jika slotnya makin sedikit
    setSelectedFiles((prev) => prev.slice(0, remainingSlots))
    setPreviews((prev) => prev.slice(0, remainingSlots))
  }, [remainingSlots])

  const addToast = (type: Toast["type"], message: string) => {
    const id = crypto.randomUUID()
    setToasts((t) => [...t, { id, type, message }])
    setTimeout(() => setToasts((t) => t.filter((tt) => tt.id !== id)), 4000)
  }

  const handleSlotChange = (idx: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setSelectedFiles((prev) => {
      const copy = [...prev]
      copy[idx] = file
      return copy
    })
  }

  const handleDrop = (idx: number, e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      setSelectedFiles((prev) => {
        const copy = [...prev]
        copy[idx] = file
        return copy
      })
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const removeSlotFile = (idx: number) => {
    setSelectedFiles((prev) => {
      const copy = [...prev]
      copy[idx] = null
      return copy
    })
  }

  const uploadFiles = async () => {
    if (loading) return
    if (remainingSlots <= 0) {
      addToast("error", "Gallery sudah penuh. Maksimal 5 gambar.")
      return
    }

    const filesToUpload = selectedFiles.filter((f): f is File => !!f)
    if (filesToUpload.length === 0) {
      addToast("error", "Pilih minimal satu gambar untuk diupload")
      return
    }

    setLoading(true)
    try {
      const compressedFiles: File[] = []
      let totalSize = 0
      for (const file of filesToUpload) {
        const options = {
          maxSizeMB: 2,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
        }
        const compressed = await imageCompression(file, options)
        const sizeMB = compressed.size / (1024 * 1024)
        totalSize += compressed.size
        compressedFiles.push(compressed)
      }

      if (totalSize > MAX_BATCH_MB * 1024 * 1024) {
        addToast("error", `Total ukuran setelah kompresi ${ (totalSize / (1024*1024)).toFixed(2) }MB melebihi batas ${MAX_BATCH_MB}MB`)
        setLoading(false)
        return
      }

      const formData = new FormData()
      compressedFiles.forEach((file) => formData.append("files", file))

      const res = await fetch(`${baseUrl}/api/gallery/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || "Gagal upload")
      }
      await fetchGallery()
      setSelectedFiles([])
      addToast("success", "Gambar berhasil diupload")
    } catch (e: any) {
      addToast("error", e.message || "Error upload")
    } finally {
      setLoading(false)
    }
  }

  const deleteImage = async (public_id: string) => {
    if (!confirm("Hapus gambar ini?")) return
    try {
      const res = await fetch(`${baseUrl}/api/gallery/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ public_id }),
      })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || "Gagal hapus gambar")
      }
      await fetchGallery()
      addToast("success", "Gambar berhasil dihapus")
    } catch (e: any) {
      addToast("error", e.message || "Gagal menghapus gambar")
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <h1 className="text-2xl font-bold mb-4 text-black">Upload Gambar di Gallery</h1>

      {/* Toasts */}
      <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded shadow-sm text-sm flex items-center gap-2 ${
              t.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {t.type === "success" ? "✓" : "⚠"} {t.message}
          </div>
        ))}
      </div>

      {/* Upload Slots */}
      {remainingSlots > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {Array.from({ length: remainingSlots }).map((_, i) => (
            <div
              key={i}
              onDrop={(e) => handleDrop(i, e)}
              onDragOver={handleDragOver}
              className="relative border border-dashed rounded-md flex flex-col items-center justify-center p-2 min-h-[140px] bg-white"
            >
              {previews[i] ? (
                <div className="w-full h-full relative">
                  <img src={previews[i]} alt={`preview ${i}`} className="object-cover w-full h-full rounded" />
                  <button
                    type="button"
                    onClick={() => removeSlotFile(i)}
                    className="absolute top-1 right-1 bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    aria-label="Remove"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label
                  htmlFor={`slot-${i}`}
                  className="flex flex-col items-center justify-center gap-2 cursor-pointer text-center text-sm text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  <div className="text-xs">Klik / drag foto</div>
                  <div className="text-[10px] text-gray-500">Max 1 per kotak</div>
                  <input
                    id={`slot-${i}`}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => handleSlotChange(i, e)}
                  />
                </label>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={uploadFiles}
          disabled={loading || remainingSlots <= 0}
          className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-60"
        >
          {loading ? "Uploading..." : "Upload Semua"}
        </button>
        <button
          onClick={() => setSelectedFiles([])}
          disabled={loading}
          className="px-6 py-2 border rounded-md"
        >
          Reset Pilihan
        </button>
      </div>

      {/* Gallery */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Gallery Desa</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.public_id} className="relative border rounded overflow-hidden">
              <img src={img.url} alt="" className="w-full h-32 object-cover" />
              <button
                onClick={() => deleteImage(img.public_id)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                aria-label="Delete"
              >
                ×
              </button>
            </div>
          ))}
          {images.length === 0 && (
            <div className="col-span-full text-center text-sm text-gray-500">Tidak ada gambar.</div>
          )}
        </div>
      </div>
    </div>
  )
}
