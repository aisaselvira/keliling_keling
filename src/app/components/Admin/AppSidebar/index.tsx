"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import { LogOut, Newspaper, Store, Compass, House, Images } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet"
import AdminHeader from "../AppHeader"
import { Button } from "@headlessui/react"

const menu = [
  { href: "/admin/article", label: "Article", icon: <Newspaper className="inline-block" /> },
  { href: "/admin/umkm", label: "UMKM", icon: <Store className="inline-block" /> },
  { href: "/admin/pariwisata", label: "Pariwisata", icon: <Compass className="inline-block" /> },
  { href: "/admin/desa", label: "Desa", icon: <House className="inline-block" /> },
  { href: "/admin/gallery", label: "Gallery", icon: <Images className="inline-block" /> },
]

export default function AdminSidebarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname() || ""
  const [open, setOpen] = React.useState(false)

  const handleLogout = () => {
    localStorage.removeItem("user")
    document.cookie = "token=; Max-Age=0; path=/"
    window.location.href = "/"
  }

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin" || pathname === "/admin/"
    return pathname === href || pathname.startsWith(href + "/")
  }

  React.useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* mobile sidebar sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <AdminHeader onMenuClick={() => setOpen(true)} />
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-xl font-bold">Admin Panel</h2>
            <SheetClose asChild>
              <button
                aria-label="Close menu"
                className="p-1 rounded hover:bg-gray-100"
              >
                ✕
              </button>
            </SheetClose>
          </div>
          <div className="px-4 py-4 flex-1">
            <div className="mb-3 text-xs font-semibold uppercase text-gray-500">
              Menu
            </div>
            <nav className="space-y-1">
              {menu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "group flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition",
                    isActive(item.href)
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="px-4 py-4 border-t">
            <Link
              href="/logout"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="inline-block" />
              <span>Logout</span>
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      {/* desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 flex-shrink-0 bg-white border-r overflow-y-auto">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <div className="flex-1 px-2 py-4">
          <div className="mb-3 text-xs font-semibold uppercase text-gray-500">
            Menu
          </div>
          <nav className="space-y-1">
            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "group flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition",
                  isActive(item.href)
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="px-4 py-4 border-t">
          <Button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="inline-block" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* main content */}
      <div className="flex-1 flex flex-col">
        <div className="h-16" /> {/* spacer for fixed header */}
        <div className="flex-1 overflow-x-auto px-4 py-6">
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  )
}
