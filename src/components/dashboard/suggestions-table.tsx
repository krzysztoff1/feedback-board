"use client";

import { memo, useState } from "react";
import type { RouterOutput } from "~/server/api/root";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  type ColumnDef,
  type PaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type SortingState,
  getSortedRowModel,
  type VisibilityState,
} from "@tanstack/react-table";
import { Button } from "../ui/button";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { PAGE_SIZE } from "~/lib/constants";
import { ArrowUpDown } from "lucide-react";
import { truncate } from "~/lib/utils";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type Row = RouterOutput["suggestions"]["get"][number];

export const columns: ColumnDef<Row>[] = [
  {
    accessorKey: "title",
    header: "Title",
    size: 50,
    minSize: 50,
    maxSize: 50,
    cell: ({ row }) => <b>{row.getValue("title")}</b>,
  },
  {
    accessorKey: "content",
    header: "Content",
    size: 50,
    cell: ({ row }) => truncate(row.getValue("content")),
  },
  {
    accessorKey: "user.name",
    size: 50,
    header: "User",
  },
  {
    accessorKey: "upVotes",
    size: 50,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Votes
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString();
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];

const prettyColumnNames: Record<string, string> = {
  title: "Title",
  content: "Content",
  user_name: "User",
  upVotes: "Votes",
  createdAt: "Created At",
};

interface SuggestionTableProps {
  readonly totalSuggestionsCount: number;
}

export const SuggestionTable = memo(
  ({ totalSuggestionsCount }: SuggestionTableProps) => {
    const { slug } = useParams();

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
      {},
    );
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: PAGE_SIZE,
    });

    const suggestions = api.suggestions.get.useQuery({
      slug: String(slug),
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sorting: sorting?.[0],
    });

    const table = useReactTable({
      data: suggestions?.data ?? [],
      columns,
      rowCount: totalSuggestionsCount,
      onPaginationChange: setPagination,
      getCoreRowModel: getCoreRowModel(),
      onSortingChange: setSorting,
      getSortedRowModel: getSortedRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      state: {
        pagination,
        sorting,
        columnVisibility,
      },
      manualPagination: true,
      manualSorting: true,
      defaultColumn: {
        size: 50,
        minSize: 50,
        maxSize: 500,
      },
    });

    return (
      <div>
        <div className="flex items-center py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {prettyColumnNames[column.id]}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4 rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        style={{
                          width: `${header.getSize()}px`,
                          minWidth: `${header.getSize()}px`,
                          maxWidth: `${header.getSize()}px`,
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {suggestions.isLoading
                ? new Array(pagination.pageSize).fill(0).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell colSpan={columns.length}>
                        <Skeleton className="h-8" />
                      </TableCell>
                    </TableRow>
                  ))
                : null}

              {table.getRowModel().rows?.length
                ? table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          style={{ width: `${cell.column.getSize()}px` }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : null}

              {!suggestions.isLoading && !table.getRowModel().rows?.length && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No suggestions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex w-full items-center justify-between">
          <div>
            <span className="block h-min py-1 text-sm opacity-70">
              Viewing {pagination.pageIndex * pagination.pageSize + 1} -{" "}
              {Math.min(
                (pagination.pageIndex + 1) * pagination.pageSize,
                totalSuggestionsCount,
              )}{" "}
              of {totalSuggestionsCount}
            </span>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: Math.max(prev.pageIndex - 1, 0),
                }))
              }
              disabled={pagination.pageIndex === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: Math.min(
                    prev.pageIndex + 1,
                    Math.ceil(totalSuggestionsCount / prev.pageSize) - 1,
                  ),
                }))
              }
              disabled={
                pagination.pageIndex ===
                Math.ceil(totalSuggestionsCount / pagination.pageSize) - 1
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

SuggestionTable.displayName = "SuggestionTable";
