import { Card, CardContent } from "@/components/ui/card";
import type { CategoryTableProps } from "@/types";
import {
  type PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table as UiTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";
import { HiOutlineChevronDoubleLeft } from "react-icons/hi";
import { HiOutlineChevronLeft } from "react-icons/hi";
import { HiOutlineChevronRight } from "react-icons/hi";
import { HiChevronUpDown } from "react-icons/hi2";
import { Button } from "@/components/ui/button";

const CategoryTable: React.FC<CategoryTableProps> = ({
  data,
  columns,
  isPending,
}) => {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    columns,
    data: data ?? [],
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    state: {
      pagination,
    },
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
  });

  return (
    <div className="p-2">


          <UiTable>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="mb-6">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className="font-bold"
                      >
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "flex flex-row gap-2 items-center cursor-pointer select-none"
                              : "flex flex-row gap-2 items-center cursor-pointer select-none",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <HiChevronUpDown />,
                            desc: <HiChevronUpDown />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isPending
                ? Array.from({ length: 5 }).map((_, idx) => (
                    <TableRow key={idx}>
                      {table.getVisibleLeafColumns().map((col, colIdx) => (
                        <TableCell key={colIdx}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
            </TableBody>
          </UiTable>



      <div className="h-2" />
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <HiOutlineChevronDoubleLeft />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <HiOutlineChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <HiOutlineChevronRight />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          <HiOutlineChevronDoubleRight />
        </Button>
      </div>
    </div>
  );
};

export default CategoryTable;
