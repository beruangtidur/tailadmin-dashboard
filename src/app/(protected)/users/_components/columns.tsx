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

import DialogFormTrigger from "@/components/dialog/DialogFormTrigger"
import Checkbox from "@/components/form/input/Checkbox"
import { Edit, KeyRound, Trash2 } from "lucide-react"
import InnerUserForm from "./InnerUserForm"


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
          <DialogFormTrigger title="Edit User" triggerLabel={<Edit />} triggerVariant="default" customClassTrigger="bg-emerald-700 text-white" sizeIcon={true}>
            <InnerUserForm action="edit" user={row.original} />
          </DialogFormTrigger>
          <DialogFormTrigger title="Delete User" triggerLabel={<Trash2 />} triggerVariant="default" customClassTrigger="bg-rose-500 text-white" sizeIcon={true}>
            <InnerUserForm action="delete" user={row.original} />
          </DialogFormTrigger>
          <DialogFormTrigger title="Reset Password" triggerLabel={<KeyRound />} triggerVariant="default" customClassTrigger="bg-slate-500 text-white" sizeIcon={true}>
            <InnerUserForm action="reset" user={row.original} />
          </DialogFormTrigger>
        </div>

      )
    }
  }
]
export default columns
