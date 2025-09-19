"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
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
import DialogFormTrigger from "./DialogFormTrigger"


const columns: ColumnDef<Users>[] = [
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
    header: "Email"
    // ({ column }) => {
      // return (

      //   <Button
      //     variant="ghost"
      //     onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      //   >
      //     Email
      //     {(column.getIsSorted() === "asc") ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />}
      //     {/* // <ArrowUpDown className="ml-2 h-4 w-4" /> */}
      //   </Button>
      // )
    // },
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    // accessorKey: 'action',
    header: "Action",
    cell: ({ row }) => {
      // console.log(row.original)
      return (
        <div className="flex gap-2">
          <DialogFormTrigger action="edit" user={row.original}/>
          <DialogFormTrigger action="delete" user={row.original}/>
          <DialogFormTrigger action="reset" user={row.original}/>

          {/* <Button size="icon" className="size-8 bg-red-500 text-white">
            <Trash2 />
          </Button>
          <Button size="icon" className="size-8 bg-slate-700 text-white">
            <KeyRound />
          </Button> */}
        </div>

      )
    }
  }
]
export default columns
