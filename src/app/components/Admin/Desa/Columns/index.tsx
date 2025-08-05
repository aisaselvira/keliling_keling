"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { format } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Eye, SquarePen, Trash } from "lucide-react"

export type Desa = {
  id: string
  name: string
  created_by_name: string
  district: string | null
  address: string
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

export const columns: ColumnDef<Desa>[] = [
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
    accessorKey: "name",
    header: "Nama Desa",
    cell: ({ row }) => {
      const title = row.getValue("name") as string
      return (
        <Link
          href={`/admin/desa/edit/${row.original.id}`}
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
    accessorKey: "address",
    header: "Alamat",
    cell: ({ getValue }) => {
      const loc = getValue() as string
      return <span>{loc || "—"}</span>
    },
  },
  {
    accessorKey: "district",
    header: "Kecamatan",
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const id = row.original.id
      return (
        <div className="flex gap-2">
          <Link href={`/admin/desa/${id}`} passHref>
            <Button size="sm" variant="outline">
              <Eye />
            </Button>
          </Link>
          <Link href={`/admin/desa/edit/${id}`} passHref>
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

                const res = await fetch(`${baseUrl}/api/village/${id}`, {
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
