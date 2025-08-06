"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import imageCompression from "browser-image-compression"
import moment from "moment-timezone"
import { useRouter } from "next/navigation"

const ArticleEditor = dynamic(() => import("@/app/components/Admin/Editor"), {
  ssr: false,
})

export default function NewArticlePage() {
  const [title, setTitle] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [content, setContent] = useState("")
  const [location, setLocation] = useState("Desa Damarwulan")
  const [loadingDraft, setLoadingDraft] = useState(false)
  const [loadingPublish, setLoadingPublish] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.size <= 10 * 1024 * 1024) {
      setImage(file)
    } else {
      alert("Ukuran gambar maksimum 10MB")
    }
  }

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image)
      setPreview(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [image])

  const removeImage = () => {
    setImage(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const submitArticle = async (status: "Draft" | "Terpublikasi") => {
    if (status === "Draft") setLoadingDraft(true)
    else setLoadingPublish(true)

    try {
      if (!title || !content) {
        alert("Judul dan konten tidak boleh kosong.")
        return
      }

      if (!image) {
        alert("Gambar wajib diupload.")
        return
      }      

      const userRes = await fetch(`${baseUrl}/api/user/me`, { credentials: "include" })
      if (!userRes.ok) throw new Error("Gagal mengambil user")
      const userData = await userRes.json()
      const userId = userData.user_id

      let imageUrl = ""
      if (image) {
        const compressedFile = await imageCompression(image, {
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
        imageUrl = uploadData.url
      }

      const timestamp = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")

      const payload = {
        title,
        content,
        timestamp,
        user_id: userId,
        photo: imageUrl,
        location,
        status,
      }

      const res = await fetch(`${baseUrl}/api/article`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`Server error: ${errText}`)
      }

      alert(`Artikel berhasil disimpan sebagai ${status === "Terpublikasi" ? "Terpublikasi" : "Draft"}!`)
      router.push("/admin/article")
    } catch (err) {
      console.error("Gagal simpan:", err)
      alert("Terjadi kesalahan saat menyimpan artikel.")
    } finally {
      if (status === "Draft") setLoadingDraft(false)
      else setLoadingPublish(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold text-black">Buat Artikel Baru</h1>

      {/* Judul */}
      <div className="flex flex-col space-y-1">
        <label htmlFor="title" className="font-semibold">
          Judul Artikel <span className="text-red-600">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Masukkan judul artikel"
        />
      </div>

      {/* Lokasi */}
      <div className="flex flex-col space-y-1">
        <label htmlFor="location" className="font-semibold">
          Lokasi <span className="text-red-600">*</span>
        </label>
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

      {/* Upload Gambar */}
      <div className="flex flex-col space-y-1">
        <label htmlFor="image" className="font-semibold">
          Upload Gambar <span className="text-red-600">*</span>
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="file:border file:px-4 file:py-2 file:rounded-md file:bg-orange-500 file:text-white"
        />
        {preview && (
          <div className="relative mt-2 w-fit">
            <img
              src={preview}
              alt="Preview"
              className="h-32 w-auto object-cover border rounded"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Editor Konten */}
      <ArticleEditor onChange={setContent} value={content} />

      {/* Tombol */}
      <div className="flex gap-4">
        <button
          onClick={() => submitArticle("Draft")}
          disabled={loadingDraft || loadingPublish}
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-md"
        >
          {loadingDraft ? "Menyimpan draft..." : "Simpan Draft"}
        </button>
        <button
          onClick={() => submitArticle("Terpublikasi")}
          disabled={loadingDraft || loadingPublish}
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded-md"
        >
          {loadingPublish ? "Mempublikasikan..." : "Publikasikan"}
        </button>
      </div>
    </div>
  )
}
