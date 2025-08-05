"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { format } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, SquarePen, Trash } from "lucide-react"

export type UMKM = {
  id: string
  name: string
  created_by_name: string
  price: string
  category: "makanan" | "minuman" | "barang" | "archived"
  village: string | null
  publishedAt: string | null
  photos: string[]
  owner: string
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

function firstPhoto(photos: string[] | undefined | null): string | null {
  if (!photos || photos.length === 0) return null
  return photos[0]
}

function StatusBadge({ category }: { category: UMKM["category"] }) {
  const variant =
    category === "makanan"
      ? "emerald"
      : category === "minuman"
      ? "yellow"
      : category === "barang"
      ? "red"
      : "default"

  return (
    <Badge variant={variant as any}>
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </Badge>
  )
}

export const columns: ColumnDef<UMKM>[] = [
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
            if (all) {
              table.toggleAllRowsSelected(false)
            } else {
              table.toggleAllRowsSelected(true)
            }
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
    accessorKey: "photos",
    header: "Foto",
    cell: ({ getValue }) => {
      const photos = getValue() as string[] | null | undefined
      const url = firstPhoto(photos)
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
    accessorKey: "name",
    header: "Nama UMKM",
    cell: ({ row }) => {
      const title = row.getValue("name") as string
      return (
        <Link
          href={`/admin/umkm/edit/${row.original.id}`}
          className="font-medium hover:underline"
        >
          {title}
        </Link>
      )
    },
  },
  {
    accessorKey: "created_by_name",
    header: "Dibuat oleh",
  },
  {
    accessorKey: "category",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as UMKM["category"]
      return <StatusBadge category={status} />
    },
  },
  {
    accessorKey: "price",
    header: "Harga",
  },
  {
    accessorKey: "village",
    header: "Desa",
  },
  {
    accessorKey: "owner",
    header: "Pemilik",
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
      return (
        <div className="flex gap-2">
          <Link href={`/admin/umkm/${id}`} passHref>
            <Button size="sm" variant="outline">
              <Eye />
            </Button>
          </Link>
          <Link href={`/admin/umkm/edit/${id}`} passHref>
            <Button size="sm">
              <SquarePen />
            </Button>
          </Link>
          <Button
            size="sm"
            variant="destructive"
            onClick={async () => {
              if (!confirm("Hapus data UMKM ini?")) return

              try {
                const userRes = await fetch(`${baseUrl}/api/user/me`, {
                  credentials: "include",
                })
                if (!userRes.ok) throw new Error("Gagal mengambil data user")
                const userData = await userRes.json()
                const userId = userData.user_id

                const res = await fetch(`${baseUrl}/api/umkm/${id}`, {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                })

                if (!res.ok) {
                  const err = await res.json()
                  alert(`Gagal hapus: ${err.message || "Unknown error"}`)
                } else {
                  window.location.reload()
                }
              } catch (e) {
                console.error("Delete gagal", e)
                alert("Terjadi kesalahan saat menghapus data UMKM.")
              }
            }}
          >
            <Trash />
          </Button>
        </div>
      )
    },
  },
]
