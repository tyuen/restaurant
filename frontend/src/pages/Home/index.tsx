import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ky from "@/providers/ky";

import TilePanel from "./TilePanel";
import Heading from "@/components/Heading";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const limit = 12;

export default function Home() {
  const [type, setType] = useState("");
  const [offset, _setOffset] = useState(0);

  const { isPending, data, error } = useQuery<any>({
    queryKey: ["merchants", type, offset],
    queryFn: () =>
      ky.post("/api/merchant/list", { json: { type, offset, limit } }).json(),
  });

  //get list of merchant types
  const allTypes = useQuery<{ list: { id: number; type: string }[] }>({
    queryKey: ["allMerchTypes"],
    queryFn: () => ky.get("/api/merchant/all-types").json(),
  });

  return (
    <main>
      <section className="p-4 max-w-screen-xl mx-auto">
        <Heading text="Restaurants">
          {allTypes.isPending ? null : (
            <div className="grow flex items-center gap-2 ml-2">
              <Select
                value={type || "-"}
                onValueChange={s => setType(s === "-" ? "" : s)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="all" value="-">
                    All
                  </SelectItem>
                  {allTypes.data?.list?.map(item => (
                    <SelectItem key={item.id} value={"" + item.id}>
                      {item.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </Heading>
        {error ? (
          <div className="text-center py-8">
            {error.message || error.toString()}
          </div>
        ) : (
          <TilePanel loading={isPending} items={data?.list} />
        )}
      </section>
    </main>
  );
}
