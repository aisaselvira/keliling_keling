"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { format } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, SquarePen, Trash } from "lucide-react"

export type Article = {
  id: string
  title: string
  author: string
  status: "draft" | "review" | "published" | "archived"
  publishedAt: string | null
  location: string
  photo: string | null
}

const getBaseUrl = () => {
  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    console.warn("NEXT_PUBLIC_BASE_URL is not set")
    return ""
  }
  return process.env.NEXT_PUBLIC_BASE_URL
}

function StatusBadge({ status }: { status: Article["status"] }) {
  const variant =
    status === "published"
      ? "emerald"
      : status === "review"
      ? "yellow"
      : status === "archived"
      ? "destructive"
      : "default"

  return (
    <Badge variant={variant as any}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

export const columns: ColumnDef<Article>[] = [
  {
    id: "select",
    header: ({ table }) => {
      const all = table.getIsAllRowsSelected()
      const some = table.getIsSomeRowsSelected()
      const checked: boolean | "indeterminate" = all
        ? true
        : some
        ? "indeterminate"
        : false

      return (
        <Checkbox
          aria-label="Select all"
          checked={checked}
          onCheckedChange={() => {
            if (all) table.toggleAllRowsSelected(false)
            else table.toggleAllRowsSelected(true)
          }}
        />
      )
    },
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    size: 10,
  },
  {
    accessorKey: "photo",
    header: "Foto",
    cell: ({ getValue }) => {
      const url = getValue() as string | null
      if (!url) return <span className="text-sm text-gray-500">—</span>
      return (
        <img
          src={url}
          alt="thumbnail"
          className="h-10 w-10 object-cover rounded"
          loading="lazy"
        />
      )
    },
    size: 60,
  },
  {
    accessorKey: "title",
    header: "Judul",
    cell: ({ row }) => {
      const title = row.getValue("title") as string
      return (
        <Link
          href={`/admin/article/edit/${row.original.id}`}
          className="font-medium hover:underline max-w-[250px] truncate block"
        >
          {title}
        </Link>
      )
    },
  },
  {
    accessorKey: "author",
    header: "Author",
  },
  {
    accessorKey: "location",
    header: "Lokasi",
    cell: ({ getValue }) => {
      const loc = getValue() as string
      return <span>{loc || "—"}</span>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as Article["status"]
      return <StatusBadge status={status} />
    },
  },
  {
    accessorKey: "publishedAt",
    header: "Tanggal Terpublikasi",
    cell: ({ getValue }) => {
      const dt = getValue() as string | null
      if (!dt) return <span className="text-sm text-gray-500">—</span>
      try {
        return <span>{format(new Date(dt), "dd MMM yyyy")}</span>
      } catch {
        return <span>{dt}</span>
      }
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const id = row.original.id
      const baseUrl = getBaseUrl()

      const handleDelete = async () => {
        if (!confirm("Hapus artikel ini?")) return

        try {
          if (!baseUrl) throw new Error("Base URL tidak dikonfigurasi")
          // Ambil data user (jika memang diperlukan)
          const userRes = await fetch(`${baseUrl}/api/user/me`, {
            credentials: "include",
          })
          if (!userRes.ok) throw new Error("Gagal mengambil data user")
          // const userData = await userRes.json()
          // const userId = userData.user_id // kalau perlu dipakai

          const res = await fetch(`${baseUrl}/api/article/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          })

          if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            alert(`Gagal hapus: ${err.message || "Unknown error"}`)
          } else {
            // idealnya trigger re-fetch, tapi simple reload:
            window.location.reload()
          }
        } catch (e: any) {
          console.error("Delete gagal", e)
          alert(e?.message || "Terjadi kesalahan saat menghapus artikel.")
        }
      }

      return (
        <div className="flex gap-2 flex-wrap">
          <Link href={`/admin/article/${id}`} passHref>
            <Button size="sm" variant="outline">
              <Eye />
            </Button>
          </Link>
          <Link href={`/admin/article/edit/${id}`} passHref>
            <Button size="sm">
              <SquarePen />
            </Button>
          </Link>
          <Button size="sm" variant="destructive" onClick={handleDelete}>
            <Trash />
          </Button>
        </div>
      )
    },
  },
]
