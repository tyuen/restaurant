import { useState, type PropsWithChildren } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import DataEditor from "./DataEditor";
import { useProfileStore } from "@/providers/profile";
import Spinner from "@/components/Spinner";

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

const intl = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2 });

export default function DataTable({ loading, data }: Props) {
  const merchantId = useProfileStore(s => s.id);

  const [item, setItem] = useState<Item>();

  return (
    <table className="w-full tbl-headered tbl-spacious tbl-narrow-end">
      <thead>
        <tr className="border-muted-foreground border-b text-muted-foreground text-sm">
          <th>Name</th>
          <th className="text-right">Price</th>
          <th className="text-right">Action</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={3}>
              <div className="my-12 sm:my-[20vh]">
                <Spinner className="h-8 mx-auto border-foreground" />
              </div>
            </td>
          </tr>
        ) : !data?.length ? (
          <tr>
            <td colSpan={3}>
              <div className="my-12 sm:my-20 text-center text-muted-foreground">
                No items.
              </div>
            </td>
          </tr>
        ) : (
          data?.map(item => (
            <tr key={item.id} className="odd:bg-muted">
              <td>{item.name}</td>
              <td className="text-right">{intl.format(item.price)}</td>
              <td className="text-right">
                <Popover onOpenChange={isOpen => isOpen && setItem(item)}>
                  <PopoverTrigger asChild>
                    <Button>Edit</Button>
                  </PopoverTrigger>
                  <PopoverContent side="bottom" align="end">
                    <DataEditor data={item ?? { merchantId }} />
                  </PopoverContent>
                </Popover>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
