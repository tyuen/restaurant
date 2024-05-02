import { useState } from "react";
import ky from "@/providers/ky";
import { useQuery } from "@tanstack/react-query";

import Spinner from "@/components/Spinner";

import OrderPanel from "./OrderPanel";

import type { TOrder } from "./types";
import Heading from "@/components/Heading";

const limit = 1000;

export default function Products() {
  const latest = useQuery({
    queryKey: ["orders-latest"],
    queryFn: () => ky.post("/api/order/latest").json<TOrder>(),
  });

  const [offset, _setOffset] = useState(0);

  const orders = useQuery({
    queryKey: ["orders", offset],
    queryFn: () =>
      ky
        .post("/api/order/list", { json: { offset, limit } })
        .json<{ list: TOrder[] }>(),
  });

  return (
    <main className="max-w-screen-lg w-full mx-auto p-2">
      <section>
        <Heading text="Your Last Order" />

        {latest.isPending ? (
          <div className="py-16">
            <Spinner className="mx-auto border-muted-foreground w-8 h-8" />
          </div>
        ) : !latest.data?.id ? (
          <div className="text-center py-10 md:py-16 text-muted-foreground border-muted border">
            No orders.
          </div>
        ) : latest.data ? (
          <OrderPanel order={latest.data} showTotal={true} />
        ) : null}
      </section>

      <section className="mt-10">
        <Heading text="Recent Orders" />
        {orders.isPending ? (
          <div className="py-16">
            <Spinner className="mx-auto border-muted-foreground w-8 h-8" />
          </div>
        ) : !orders.data?.list?.length ? (
          <div className="text-center py-10 md:py-16 text-muted-foreground border border-muted">
            No orders.
          </div>
        ) : (
          orders.data?.list?.map(item => (
            <OrderPanel key={item.id} order={item} className="mb-10" />
          ))
        )}
      </section>
    </main>
  );
}
