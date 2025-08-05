"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import imageCompression from "browser-image-compression"
import moment from "moment-timezone"

const ArticleEditor = dynamic(() => import("@/app/components/Admin/Article/ArticleEditor"), {
  ssr: false,
})

export default function NewArticlePage() {
  const [title, setTitle] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [content, setContent] = useState("")
  const [location, setLocation] = useState("Desa Damarwulan")
  const [loadingDraft, setLoadingDraft] = useState(false)
  const [loadingPublish, setLoadingPublish] = useState(false)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.size <= 10 * 1024 * 1024) {
      setImage(file)
    } else {
      alert("Ukuran gambar maksimum 10MB")
    }
  }

  const submitArticle = async (status: "Draft" | "Terpublikasi") => {
    // set appropriate loading flag
    if (status === "Draft") setLoadingDraft(true)
    else setLoadingPublish(true)

    try {
      if (!title || !content) {
        alert("Judul dan konten tidak boleh kosong.")
        return
      }

      // ambil user
      const userRes = await fetch(`${baseUrl}/api/user/me`, { credentials: "include" })
      if (!userRes.ok) throw new Error("Gagal mengambil user")
      const userData = await userRes.json()
      const userId = userData.user_id

      // compress & upload image jika ada
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

      // timestamp Jakarta
      const timestamp = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")

      // payload
      const payload = {
        title,
        content,
        timestamp,
        user_id: userId,
        photo: imageUrl,
        location,
        status, // Draft atau Terpublikasi
      }

      const res = await fetch("http://localhost:5000/api/article", {
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
      // misal redirect setelah simpan draft/publish
      // router.push("/admin/articles")
    } catch (err) {
      console.error("Gagal simpan:", err)
      alert("Terjadi kesalahan saat menyimpan artikel.")
    } finally {
      if (status === "Draft") setLoadingDraft(false)
      else setLoadingPublish(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Buat Artikel Baru</h1>

      {/* Judul */}
      <div className="flex flex-col space-y-1">
        <label htmlFor="title" className="font-semibold">
          Judul Artikel
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Masukkan judul artikel"
        />
      </div>

      {/* Lokasi */}
      <div className="flex flex-col space-y-1">
        <label htmlFor="location" className="font-semibold">
          Lokasi
        </label>
        <select
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Desa Damarwulan">Desa Damarwulan</option>
          <option value="Desa Tempur">Desa Tempur</option>
          <option value="Kecamatan Keling">Kecamatan Keling</option>
        </select>
      </div>

      {/* Upload Gambar */}
      <div className="flex flex-col space-y-1">
        <label htmlFor="image" className="font-semibold">
          Upload Gambar
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file:border file:px-4 file:py-2 file:rounded-md file:bg-blue-500 file:text-white"
        />
        {image && <p className="text-sm text-gray-600 mt-1">Gambar terpilih: {image.name}</p>}
      </div>

      {/* Editor */}
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
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md"
        >
          {loadingPublish ? "Mempublikasikan..." : "Publikasikan"}
        </button>
      </div>
    </div>
  )
}
