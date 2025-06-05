"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "./data-table-column-header"
import { Edit, Trash, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Headers = {
  title: string,
  accessorKey: string,
  render?: (value: unknown, row: unknown) => React.ReactNode
  isSortable?: boolean,
  width?: string
}
interface DataTableData {
  id: string | number;
  [key: string]: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface DataTableProps<TData, TValue> {
  columns: Headers[]
  data: TData[]
  options?: {
    selectable?: boolean
    filterableColumn?: keyof TData
    actions?: {
      editURL?: string
      allowDelete?: boolean
    }
  },
  onDeleteClicked?: (id: string | number) => void
}

export function DataTable<TData extends DataTableData, TValue>({
  columns: headers,
  data,
  options,
  onDeleteClicked
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const columns = React.useMemo(() => {
    const mappedHeaders: ColumnDef<TData, TValue>[] = headers.map((header) => {
      return {
        accessorKey: header.accessorKey,
        header: ({ column }) => (
          <div className={`flex items-center justify-between w-full`}>
            <DataTableColumnHeader column={column} title={header.title} />
          </div>
        ),
        // cell: (info) => info.getValue(),
        cell: (info) => {
          const value = info.getValue();
          // Use the custom render function if provided, otherwise fall back to the default behavior
          return header.render ? header.render(value, info.row.original) : value;
        },
        enableSorting: header.isSortable ?? true,
        width: header.width
      }
    });

    if (options?.selectable) {
      const selectColumn: ColumnDef<TData, TValue> = {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      }
      mappedHeaders.push(selectColumn);
    }

    if (options?.actions) {
      const actionsColumn: ColumnDef<TData, TValue> = {
        header: () => <div className="flex items-center justify-end w-full"></div>,
        accessorKey: 'id',
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => {
          return (
            <div className="flex gap-2 justify-end w-full">
              <TooltipProvider>
                {options.actions?.editURL && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`${options.actions?.editURL}${row.original.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-primary text-primary-foreground">
                      <p>Edit</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                
                {options.actions?.allowDelete && (
                  <AlertDialog>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-primary text-primary-foreground">
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the record
                          and remove its associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => onDeleteClicked && onDeleteClicked(row.original.id)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </TooltipProvider>
            </div>
          )
        }
      }
      mappedHeaders.push(actionsColumn);
    }
    return mappedHeaders;
  }, [headers, options, onDeleteClicked])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        {options?.filterableColumn && (
          <Input
            placeholder={`Filter ${String(options.filterableColumn)}...`}
            value={(table.getColumn(String(options.filterableColumn))?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(String(options.filterableColumn))?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
      </div>
      <div className="rounded-md border w-full overflow-x-auto max-w-full">
        <Table className="w-full table-fixed">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                  // Get the width from the original column definition if it exists
                  const originalColDef = headers.find(h => h.accessorKey === header.column.id);
                  const colWidth = originalColDef?.width;
                  
                  return (
                    <TableHead 
                      key={header.id} 
                      style={colWidth ? {width: colWidth, minWidth: colWidth} : {}}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );})}
                </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-y-2 py-4">
        <div className="flex flex-col">
          {options?.selectable && (
            <span className="text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
            </span>
          )}
          <span className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} | Showing {table.getRowModel().rows.length} of {data.length} entries.
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {Array.from({ length: table.getPageCount() }, (_, i) => (
            <Button
              key={i}
              variant={table.getState().pagination.pageIndex === i ? "default" : "outline"}
              size="sm"
              onClick={() => table.setPageIndex(i)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}