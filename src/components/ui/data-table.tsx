"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  RowSelectionState,
  getPaginationRowModel,
  type ColumnFiltersState,
  getFilteredRowModel,
  type Column
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react"
import { Button } from "./button"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./pagination"
import { Input } from "./input"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  isLoading: boolean
}
interface GlobalFilter {
  globalFilter: any
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input {...props} value={value} onChange={e => setValue(e.target.value)} />
  )
}


function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue()

  return (
    <DebouncedInput
      type="text"
      value={(columnFilterValue ?? '') as string}
      onChange={value => column.setFilterValue(value)}
      placeholder={`Search...`}
      className="w-36 border shadow rounded"
    />
  )
}
export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState<any>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter, // built-in filter function
    state: {
      sorting,
      rowSelection,
      columnFilters,
      globalFilter
    },
  })


  return (
    <div>
      <div className="flex items-center py-4 justify-end">
        {/* <Input /> */}
        <Input
          placeholder="Search..."
          // value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          value={globalFilter ?? ""}

          onChange={e => table.setGlobalFilter(String(e.target.value))}
          className="max-w-sm"
        />
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null : (
                          <>
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? 'cursor-pointer select-none flex items-center'
                                  : '',
                                onClick: header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: <ArrowUp  className="ml-2 h-4 w-4"  />,
                                desc: <ArrowDown  className="ml-2 h-4 w-4" />,
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                            {/* {header.column.getCanFilter() ? (
                              <div>
                                <Filter column={header.column} />
                              </div>
                            ) : null} */}
                          </>

                        )}
                      {/* 
                        // flexRender(
                        //   header.column.columnDef.header,
                        //   header.getContext()
                        // )} */}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {

              (table.getRowModel().rows?.length) ?

                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
                :
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>

            }

          </TableBody>
        </Table>
        <Pagination>
          <PaginationContent>
            {/* Previous */}
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  table.previousPage()
                }}
                className={table.getCanPreviousPage() ? "" : "pointer-events-none opacity-50"}
              />
            </PaginationItem>

            {/* Page Numbers */}
            {Array.from({ length: table.getPageCount() }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={table.getState().pagination.pageIndex === i}
                  onClick={(e) => {
                    e.preventDefault()
                    table.setPageIndex(i)
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {/* Next */}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  table.nextPage()
                }}
                className={table.getCanNextPage() ? "" : "pointer-events-none opacity-50"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        {/* <div className="flex items-center justify-end space-x-2 py-4">

        <Button
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </Button>
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </Button>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </Button>
        <Button
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </Button>
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
        
      </div> */}
        {
          table.getFilteredSelectedRowModel().rows.length != 0 &&
          <div className="mt-4 ml-3 text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
        }

      </div >
    </div >
  )
}