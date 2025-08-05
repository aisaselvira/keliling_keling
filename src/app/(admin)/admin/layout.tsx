"use client"

import * as React from "react"
import AdminSidebarLayout from "@/app/components/Admin/AppSidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  React.useEffect(() => {
    document.documentElement.classList.remove("dark")
    document.documentElement.classList.add("light")
  }, [])

  return <AdminSidebarLayout>{children}</AdminSidebarLayout>
}
