"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const data: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
  { id: 3, name: "Alice Brown", email: "alice@example.com", role: "Moderator" },
  { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Moderator" },
  { id: 5, name: "Alice Brown", email: "alice@example.com", role: "Moderator" },
  { id: 6, name: "Alice Brown", email: "alice@example.com", role: "Moderator" },
  { id: 3, name: "Alice Brown", email: "alice@example.com", role: "Moderator" },
  { id: 3, name: "Alice Brown", email: "alice@example.com", role: "Moderator" },
  { id: 3, name: "Alice Brown", email: "alice@example.com", role: "Moderator" },
  { id: 3, name: "Alice Brown", email: "alice@example.com", role: "Moderator" },
  { id: 3, name: "Alice Brown", email: "alice@example.com", role: "Moderator" },
  { id: 3, name: "Alice Brown", email: "alice@example.com", role: "Moderator" },
  { id: 3, name: "Alice Brown", email: "alice@example.com", role: "Moderator" },
  { id: 3, name: "Alice Brown", email: "alice@example.com", role: "Moderator" },
  { id: 3, name: "Alice Brown", email: "alice@example.com", role: "Moderator" },
  { id: 3, name: "Alice Brown", email: "alice@example.com", role: "Moderator" },
  { id: 3, name: "Alice Brown", email: "alice@example.com", role: "Moderator" },
  { id: 3, name: "Alice Brown", email: "alice@example.com", role: "Moderator" },
];

const columns: ColumnDef<User>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
];

export function DataTable() {
  // const [rowSelection, setRowSelection] = useState({});
  // const [pagination, setPagination] = useState<PaginationState>({
  //   pageIndex: 0,
  //   pageSize: 5, // Set the number of rows per page
  // });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full border rounded-lg">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-end gap-2 items-center m-3">
        <span className="text-sm text-muted-foreground">
          {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </span>
        <Button
          variant="default"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          size="sm"
          variant="default"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
