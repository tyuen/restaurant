import { type PropsWithChildren } from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Item = {
  id: number;
  merchantId: number;
  name: string;
  price: number;
};

type Props = PropsWithChildren & {
  loading: boolean;
  data?: Item[];
};

const limit = 15;

const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "btns",
    header: "-",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
];

export default function DataTable({ loading, data }: Props) {
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map(group => (
          <TableRow key={group.id}>
            {group.headers.map(i => {
              return (
                <TableHead key={i.id}>
                  {i.isPlaceholder
                    ? null
                    : flexRender(i.column.columnDef.header, i.getContext())}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              Loading...
            </TableCell>
          </TableRow>
        ) : table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map(row => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No records.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
