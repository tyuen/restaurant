import { useMemo, useState, type PropsWithChildren } from "react";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import DataEditor from "./DataEditor";
import { useProfileStore } from "@/providers/profile";

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

const intl = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 });

export default function DataTable({ loading, data }: Props) {
  const merchantId = useProfileStore(s => s.id);

  const [item, setItem] = useState<Item>();

  const fillItem = id => {
    const obj = data?.find(i => i.id === id);
    if (obj) setItem(obj);
  };

  const columns: ColumnDef<Item>[] = useMemo(
    () =>
      [
        {
          accessorKey: "name",
          header: "Name",
        },
        {
          accessorKey: "price",
          header: "Price",
          cell: prop => intl.format(prop.getValue() as number),
        },
        {
          accessorKey: "id",
          header: "Edit",
          cell: prop => (
            <Popover
              onOpenChange={isOpen => isOpen && fillItem(prop.getValue())}
            >
              <PopoverTrigger asChild>
                <Button>Edit</Button>
              </PopoverTrigger>
              <PopoverContent side="bottom" align="end">
                <DataEditor data={item ?? { merchantId }} />
              </PopoverContent>
            </Popover>
          ),
          size: 10,
        },
      ] satisfies ColumnDef<Item>[],
    [data, merchantId, item],
  );

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
                <TableCell
                  key={cell.id}
                  style={{ width: cell.column.getSize() + "rem" }}
                >
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
