"use client"

import React, { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"

type User = {
  user_id: string
  username: string
  email: string
  name: string
  telephone: string | null
  role: string
}

export default function EditProfileForm() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    username: "",
    email: "",
    name: "",
    telephone: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!baseUrl) throw new Error("BASE_URL not configured")
        const res = await fetch(`${baseUrl}/api/user/me`, {
          credentials: "include",
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const userData = await res.json()
        setUser(userData)
        setForm((prev) => ({
          ...prev,
          username: userData.username || "",
          email: userData.email || "",
          name: userData.name || "",
          telephone: userData.telephone || "",
        }))
      } catch (err: any) {
        setError(err.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [baseUrl])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!baseUrl) throw new Error("BASE_URL not configured")

       // Validasi field wajib
    if (!form.username.trim()) {
      alert("Username wajib diisi.")
      return
    }
    if (!form.email.trim()) {
      alert("Email wajib diisi.")
      return
    }
    if (!form.name.trim()) {
      alert("Nama wajib diisi.")
      return
    }  
      // Validasi password
      if (form.password) {
        if (form.password.length < 6) {
          alert("Password minimal 6 karakter.")
          return
        }
        if (form.password !== form.confirmPassword) {
          alert("Konfirmasi password tidak cocok.")
          return
        }
      }

      const { confirmPassword, ...rest } = form
      const payload =
        rest.password?.trim() === "" ? { ...rest, password: undefined } : rest

      const res = await fetch(`${baseUrl}/api/user/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.message || "Update failed")

      window.dispatchEvent(new Event("profileUpdated"))
      alert("Profil berhasil diperbarui!")
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat menyimpan data.")
    }
  }

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white rounded-md shadow space-y-4"
    >
      <h2 className="text-lg font-semibold text-black">Edit Profil</h2>

      <div>
        <Label htmlFor="username">Username <span className="text-red-600">*</span></Label>
        <Input
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email <span className="text-red-600">*</span></Label>
        <Input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="name">Name <span className="text-red-600">*</span></Label>
        <Input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="telephone">Telephone (opsional)</Label>
        <Input
          name="telephone"
          value={form.telephone || ""}
          onChange={handleChange}
        />
      </div>

      {/* Password Baru */}
      <div>
        <Label htmlFor="password">Password Baru (Opsional)</Label>
        <div className="relative">
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            placeholder="Kosongkan jika tidak ingin mengganti password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Konfirmasi Password */}
      <div>
        <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
        <div className="relative">
          <Input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Ulangi password baru"
          />
          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword((prev) => !prev)
            }
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <Button type="submit" className="mt-4 bg-orange-600 hover:bg-orange-400">
        Simpan Perubahan
      </Button>
    </form>
  )
}
