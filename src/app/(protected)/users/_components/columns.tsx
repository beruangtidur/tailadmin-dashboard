"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit, KeyRound, Trash2 } from "lucide-react"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Users = {
  id: string
  username: string
  email: string
  role: string
  createdAt: string
}

import Checkbox from "@/components/form/input/Checkbox"
import { Button } from "@/components/ui/button"

export const columns: ColumnDef<Users>[] = [
  {
    id: 'select-col',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
          // (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"

      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (

        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    // accessorKey: 'action',
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex gap-1">
          <Button size="icon" className="size-8 bg-green-700 text-white">
            <Edit />
          </Button>
          <Button size="icon" className="size-8 bg-red-500 text-white">
            <Trash2 />
          </Button>
          <Button size="icon" className="size-8 bg-slate-700 text-white">
            <KeyRound />
          </Button>
        </div>

      )
    }
  }
]