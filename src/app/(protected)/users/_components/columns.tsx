"use client"

import { ColumnDef } from "@tanstack/react-table"
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
import DialogFormTrigger from "./DialogFormTrigger"


const columns: ColumnDef<Users>[] = [
  {
    id: 'select-col',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
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
    header: "Email"
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <DialogFormTrigger action="edit" user={row.original}/>
          <DialogFormTrigger action="delete" user={row.original}/>
          <DialogFormTrigger action="reset" user={row.original}/>
        </div>

      )
    }
  }
]
export default columns
