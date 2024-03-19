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
} from "@tanstack/react-table";
import { Button } from "../ui/button";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";

type Row = RouterOutput["suggestions"]["get"][number];

export const columns: ColumnDef<Row>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <b>{row.getValue("title")}</b>,
  },
  {
    accessorKey: "content",
    header: "Content",
  },
  {
    accessorKey: "user.name",
    header: "User",
  },
  {
    accessorKey: "upVotes",
    header: "Upvotes",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      console.log(row.getValue("createdAt"));
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString();
    },
  },
];

interface SuggestionTableProps {
  readonly totalSuggestionsCount: number;
}

export const SuggestionTable = memo(
  ({ totalSuggestionsCount }: SuggestionTableProps) => {
    const { slug } = useParams();
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

    const suggestions = api.suggestions.get.useQuery({
      slug: String(slug),
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
    });

    const table = useReactTable({
      data: suggestions?.data ?? [],
      columns,
      rowCount: totalSuggestionsCount,
      state: { pagination },
      onPaginationChange: setPagination,
      getCoreRowModel: getCoreRowModel(),
      manualPagination: true,
    });

    return (
      <div>
        <div className="mt-4 rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
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
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
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
    );
  },
);

SuggestionTable.displayName = "SuggestionTable";
