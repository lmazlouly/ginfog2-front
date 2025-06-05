"use client"

import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

type SkeletonColumn = {
  accessorKey: string
  title: string
  isSortable?: boolean
}

/**
 * Props for the DataTableSkeleton.
 * @param columns - The same columns array you'd pass to your real DataTable
 * @param rowCount - Number of skeleton rows to display
 */
interface DataTableSkeletonProps {
  columns: SkeletonColumn[]
  rowCount?: number
}

export function DataTableSkeleton({
  columns,
  rowCount = 5,
}: DataTableSkeletonProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.accessorKey}>
              {col.title}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rowCount }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((col) => (
              <TableCell key={col.accessorKey}>
                <Skeleton className="h-4 w-3/4" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
