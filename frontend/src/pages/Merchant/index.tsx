import { useMemo, useRef, useState } from "react";
import ky from "@/providers/ky";
import { useQuery } from "@tanstack/react-query";
import { useProfileStore } from "@/providers/profile";

import { Button } from "@/components/ui/button";
import { Navigate, useParams } from "react-router-dom";
import Spinner from "@/components/Spinner";
import { EarthIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import NumInput from "@/components/NumInput";
import { useReRender } from "@/lib/utils";

type Item = {
  id: number;
  merchantId: number;
  name: string;
  price: number;
};

const limit = 1000;

const intl = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 });

export default function Products() {
  const { id: merchantId } = useParams();

  const merchant = useQuery({
    queryKey: ["merchant", merchantId],
    queryFn: () =>
      ky.post("/api/merchant/get", { json: { id: merchantId } }).json(),
    enabled: merchantId >= 0,
  });

  const [offset, setOffset] = useState(0);

  const products = useQuery({
    queryKey: ["products", merchantId, offset],
    queryFn: () =>
      ky
        .post("/api/product/list", { json: { merchantId, offset, limit } })
        .json<{ list: Item[] }>(),
    enabled: merchantId >= 0,
  });

  const reRender = useReRender();
  const { current: quantity } = useRef(new Map<number, string>());

  const total = products.data?.list.reduce(
    (sum, cur) => sum + cur.price * parseFloat(quantity.get(cur.id) ?? "0"),
    0,
  );

  const role = useProfileStore(s => s.role);

  if (!(merchantId > 0)) return <Navigate to="/" />;

  return (
    <main className="max-w-screen-lg w-full mx-auto p-2">
      <section className="flex gap-4 my-4 items-center">
        <EarthIcon className="w-20 h-20 p-1 bg-muted text-muted-foreground rounded-md" />
        <div>
          <h1 className="text-3xl font-bold">{merchant.data?.name ?? "-"}</h1>
          <div className="text-muted-foreground">
            {merchant.data?.address ?? "-"}
          </div>
        </div>
      </section>

      <table className="w-full tbl-headered tbl-spacious tbl-narrow-end">
        <thead>
          <tr className="border-muted-foreground border-b">
            <th className="py-3">Name</th>
            <th className="py-3">Price</th>
            <th className="py-3">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.isPending ? (
            <tr>
              <td colSpan={3}>
                <div className="my-12 sm:my-[20vh]">
                  <Spinner className="h-8 mx-auto border-foreground" />
                </div>
              </td>
            </tr>
          ) : products.data?.list?.length === 0 ? (
            <tr>
              <td colSpan={3}>
                <div className="my-12 sm:my-20 text-center text-muted-foreground">
                  No products yet.
                </div>
              </td>
            </tr>
          ) : (
            products.data?.list?.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{intl.format(item.price)}</td>
                <td>
                  <NumInput
                    value={quantity.get(item.id) || "0"}
                    setValue={num => {
                      quantity.set(item.id, num);
                      reRender();
                    }}
                    disabled={role !== "customer"}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="flex justify-end gap-2 md:gap-6 items-center mt-8 px-2 md:px-4">
        <div className="font-bold text-xl">Total: {intl.format(total)}</div>
        <Button size="lg" disabled={role !== "customer"}>
          Order
        </Button>
      </div>
    </main>
  );
}
