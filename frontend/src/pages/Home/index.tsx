import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ky from "@/providers/ky";

import TilePanel from "./TilePanel";
import Heading from "@/components/Heading";

const limit = 12;

export default function Home() {
  const [type, setType] = useState("");
  const [offset, setOffset] = useState(0);

  const { isPending, data, error } = useQuery({
    queryKey: ["merchants", type, offset],
    queryFn: () =>
      ky.post("/api/merchant/list", { json: { type, offset, limit } }).json(),
  });

  return (
    <main>
      <section className="p-4 max-w-screen-xl mx-auto">
        <Heading text="Restaurants" />
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
