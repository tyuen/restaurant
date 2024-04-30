import { useState } from "react";
import ky from "@/providers/ky";
import { useQuery } from "@tanstack/react-query";
import { useProfileStore } from "@/providers/profile";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// import DataEditor from "./DataEditor";
import DataTable from "./DataTable";
import DataEditor from "./DataEditor";

type Item = {
  id: number;
  merchantId: number;
  name: string;
  price: number;
};

const limit = 15;

export default function Products() {
  const [offset, setOffset] = useState(0);

  const merchantId = useProfileStore(s => s.id);

  const { isPending, data, error } = useQuery({
    queryKey: ["products", merchantId, offset],
    queryFn: () =>
      ky
        .post("/api/product/list", { json: { merchantId, offset, limit } })
        .json<{ list: Item[] }>(),
    enabled: merchantId >= 0,
  });

  const [item, setItem] = useState<Partial<Item> | null>(null);

  return (
    <main className="max-w-screen-lg w-full mx-auto p-2">
      <div className="flex justify-end">
        <Popover onOpenChange={isOpen => isOpen && setItem({ merchantId })}>
          <PopoverTrigger asChild>
            <Button>Add Product</Button>
          </PopoverTrigger>
          <PopoverContent side="bottom" align="end">
            <DataEditor data={item} />
          </PopoverContent>
        </Popover>
      </div>

      <DataTable loading={isPending} data={data?.list} />
    </main>
  );
}
