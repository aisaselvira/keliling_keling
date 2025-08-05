"use client"

import * as React from "react"
import { CircleUser, ChevronDown, LogOut, Menu, UserRound, LogOutIcon, Globe } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export default function AdminHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const [name, setName] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL 
  const router = useRouter()

  React.useEffect(() => {
    let cancelled = false
  
    const fetchUser = async () => {
      try {
        const userRes = await fetch(`${baseUrl}/api/user/me`, {
          credentials: "include",
        })
        if (!userRes.ok) throw new Error("Gagal ambil user")
        const userData = await userRes.json()
        if (!cancelled && userData?.name) {
          setName(userData.name)
        }
      } catch (err) {
        console.error("Gagal fetch user:", err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
  
    fetchUser()
  
    const handleProfileUpdated = () => {
      fetchUser()
    }
  
    window.addEventListener("profileUpdated", handleProfileUpdated)
  
    return () => {
      cancelled = true
      window.removeEventListener("profileUpdated", handleProfileUpdated)
    }
  }, [baseUrl])
  

  const handleLogout = () => {
    localStorage.removeItem("user")
    document.cookie = "token=; Max-Age=0; path=/"
    window.location.href = "/"
  }

  const handleInfoAkun = () => {
    router.push('/admin/profile')
  }

  const handleToSite = () => {
    router.push('/')
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50 md:pl-64">
      <div className="relative flex items-center h-full px-4 sm:px-6 md:px-8">
        {/* left: mobile menu */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            aria-label="Open menu"
            className="md:hidden p-2 rounded-md hover:bg-gray-100 text-gray-600"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* center filler */}
        <div className="flex-1" />

        {/* right: user */}
        <div className="flex items-center gap-3">
          {!name && loading && (
            <div className="text-sm text-gray-500">Memuat user...</div>
          )}
          {name && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-2 cursor-pointer rounded-md px-2 py-1 hover:bg-gray-100">
                <CircleUser className="w-6 h-6 text-gray-700" />
                <div className="hidden sm:flex flex-col min-w-0 leading-tight">
                  <span className="truncate text-gray-800 font-medium text-sm">{name}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="mt-2 w-44">
              <DropdownMenuItem onClick={handleToSite}>
                  <Globe  className="inline-block"/> Lihat Website
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleInfoAkun}>
                  <UserRound  className="inline-block"/> Informasi Akun
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}><LogOutIcon className="inline-block"/>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
