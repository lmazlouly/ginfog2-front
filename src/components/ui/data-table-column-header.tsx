import {
  ArrowDownIcon,
  ArrowUpDown,
  ArrowUpIcon,
} from "lucide-react";
import { type Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  // isSortable?: boolean;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  // isSortable,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {column.getCanSort() ? (
        <Button
          variant="ghost"
          size="default"
          className="-ml-3 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span>{title}</span>
          {column.getIsSorted() === "desc" ? (
            <ArrowDownIcon className="ml-2 size-4" aria-hidden="true" />
          ) : column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 size-4" aria-hidden="true" />
          ) : (
            <ArrowUpDown className="ml-2 size-4" aria-hidden="true" />
          )}
        </Button>
      ) : (
        <div className={cn(className)}>{title}</div>
      )}
    </div>
  );
}
