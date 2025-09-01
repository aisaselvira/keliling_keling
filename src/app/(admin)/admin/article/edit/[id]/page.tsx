"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import imageCompression from "browser-image-compression"
import { useRouter, useParams } from "next/navigation"
import moment from "moment-timezone"
import { toast } from "react-toastify"

const ArticleEditor = dynamic(() => import("@/app/components/Admin/Editor"), {
  ssr: false,
})

type ArticlePayload = {
  title: string
  content: string
  timestamp: string
  user_id: string
  photo: string
  location: string
  status: "Terpublikasi"
}

// Fungsi ekstrak public_id dari URL gambar (misal nama file tanpa ekstensi)
function extractPublicIdFromUrl(url: string | null): string | null {
  if (!url) return null
  try {
    const urlObj = new URL(url)
    const parts = urlObj.pathname.split('/')
    const filename = parts[parts.length - 1] // ambil nama file terakhir
    // Hapus ekstensi, misal .jpg, .png
    const publicId = filename.replace(/\.[^/.]+$/, "")
    return publicId
  } catch {
    return null
  }
}

export default function EditArticlePage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [location, setLocation] = useState("Desa Damarwulan")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string>("")

  const [existingPhotoPublicId, setExistingPhotoPublicId] = useState<string | null>(null)

  // Fetch artikel dan ekstrak public_id dari photo URL
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/article/${id}`, {
          credentials: "include",
        })
        if (!res.ok) throw new Error("Gagal memuat artikel")
        const a = await res.json()

        setTitle(a.title || "")
        setContent(a.content || "")
        setLocation(a.location || "Desa Damarwulan")
        setImagePreview(a.photo || null)
        setUserId(a.user_id)

        // Ekstrak public_id dari URL photo dan simpan di state
        const pubId = extractPublicIdFromUrl(a.photo || null)
        setExistingPhotoPublicId(pubId)
      } catch (e) {
        console.error("fetch article error", e)
        alert("Gagal memuat artikel")
      }
    }
    fetchArticle()
  }, [id])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran gambar maksimum 10MB")
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      if (!title.trim() || !content.trim()) {
        alert("Judul dan konten tidak boleh kosong.")
        setLoading(false)
        return
      }
  
      let effectiveUserId = userId
      if (!effectiveUserId) {
        const userRes = await fetch(`${baseUrl}/api/user/me`, { credentials: "include" })
        if (!userRes.ok) throw new Error("Gagal mengambil user")
        const userData = await userRes.json()
        effectiveUserId = userData.user_id
      }
  
      let finalImageUrl = imagePreview // default: gambar lama
      let finalPublicId = existingPhotoPublicId
  
      // Jika user mengganti gambar
      if (imageFile) {
        // Hapus gambar lama kalau ada
        if (existingPhotoPublicId) {
          const delRes = await fetch(`${baseUrl}/api/article/upload`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ public_id: existingPhotoPublicId }),
            credentials: 'include',
          })
          if (!delRes.ok) {
            console.warn('Gagal hapus gambar lama', await delRes.text())
          }
        }
  
        // Upload gambar baru
        const compressedFile = await imageCompression(imageFile, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
        })
        const formData = new FormData()
        formData.append("image", compressedFile)
  
        const uploadRes = await fetch(`${baseUrl}/api/article/upload`, {
          method: "POST",
          credentials: "include",
          body: formData,
        })
        if (!uploadRes.ok) throw new Error("Gagal upload gambar")
        const uploadData = await uploadRes.json()
  
        finalImageUrl = uploadData.url
        finalPublicId = extractPublicIdFromUrl(uploadData.url)
      }
  
      const timestamp = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
  
      const payload: ArticlePayload = {
        title: title.trim(),
        content,
        timestamp,
        user_id: effectiveUserId,
        photo: finalImageUrl ?? "", // penting: tetap kirim URL image
        location,
        status: "Terpublikasi",
      }
  
      const res = await fetch(`${baseUrl}/api/article/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      })
  
      if (!res.ok) {
        let detail = ''
        try {
          const json = await res.json()
          console.log("Error response JSON:", json)
          detail = json.message || JSON.stringify(json)
        } catch {
          detail = await res.text()
          console.log("Error response text:", detail)
        }
        throw new Error(detail || 'Gagal menyimpan')
      }
      
      toast.success('Artikel berhasil diperbarui')
      router.push("/admin/article")
    } catch (e) {
      console.error("update error", e)
      alert("Gagal menyimpan artikel")
    } finally {
      setLoading(false)
    }
  }
  

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-black">Edit Artikel</h1>

      <div className="flex flex-col space-y-1">
        <label htmlFor="title" className="font-semibold">Judul Artikel <span className="text-red-600">*</span></label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Masukkan judul artikel"
        />
      </div>

      <div className="flex flex-col space-y-1">
        <label htmlFor="location" className="font-semibold">Lokasi <span className="text-red-600">*</span></label>
        <select
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="Desa Damarwulan">Desa Damarwulan</option>
          <option value="Desa Tempur">Desa Tempur</option>
          <option value="Desa Bumiharjo">Desa Bumiharjo</option>
          <option value="Desa Gelang">Desa Gelang</option>
          <option value="Desa Jlegong">Desa Jlegong</option>
          <option value="Desa Kaligarang">Desa Kaligarang</option>
          <option value="Desa Kelet">Desa Kelet</option>
          <option value="Desa Keling">Desa Keling</option>
          <option value="Desa Klepu">Desa Klepu</option>
          <option value="Desa Kunir">Desa Kunir</option>
          <option value="Desa Tunahan">Desa Tunahan</option>
          <option value="Desa Watuaji">Desa Watuaji</option>
          <option value="Kecamatan Keling">Kecamatan Keling</option>
        </select>
      </div>

      <div className="flex flex-col space-y-1">
        <label htmlFor="image" className="font-semibold">Gambar <span className="text-red-600">*</span></label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file:border file:px-4 file:py-2 file:rounded-md file:bg-orange-600 file:text-white"
        />
        {imagePreview && (
          <div className="mt-2">
            <p className="text-sm mb-1">Preview:</p>
            <img src={imagePreview} alt="preview" className="w-48 h-auto rounded" />
          </div>
        )}
      </div>

      <ArticleEditor onChange={setContent} value={content} />

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded-md"
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  )
}
