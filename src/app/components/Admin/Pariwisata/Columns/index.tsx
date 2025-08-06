"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { format } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Eye, SquarePen, Trash } from "lucide-react"

export type Pariwisata = {
  id: string
  name: string
  created_by_name: string
  village: string | null
  publishedAt: string | null
  location: string
  photos: string[]
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

function firstPhoto(photos: string[] | undefined | null): string | null {
  if (!photos || photos.length === 0) return null
  return photos[0]
}

export const columns: ColumnDef<Pariwisata>[] = [
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
    header: "Nama Pariwisata",
    cell: ({ row }) => {
      const title = row.getValue("name") as string
      return (
        <Link
          href={`/admin/pariwisata/edit/${row.original.id}`}
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
    accessorKey: "location",
    header: "Lokasi",
    cell: ({ getValue }) => {
      const loc = getValue() as string
      return (
        <span className="block max-w-[160px] truncate whitespace-nowrap overflow-hidden">
          {loc || "—"}
        </span>
      )
    },
  },  
  {
    accessorKey: "village",
    header: "Desa",
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
          <Link href={`/pariwisata/${id}`} passHref>
            <Button size="sm" variant="outline">
              <Eye />
            </Button>
          </Link>
          <Link href={`/admin/pariwisata/edit/${id}`} passHref>
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

                const res = await fetch(`${baseUrl}/api/tourism/${id}`, {
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
