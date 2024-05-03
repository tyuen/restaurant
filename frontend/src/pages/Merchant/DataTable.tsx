import type { PropsWithChildren } from "react";
import ky from "@/providers/ky";
import { useMap } from "ahooks";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useProfileStore } from "@/providers/profile";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import Spinner from "@/components/Spinner";
import NumInput from "@/components/NumInput";

import type { TProduct } from "./types";

type Props = PropsWithChildren & {
  merchantId: number;
};

type SubmitOrders = {
  merchantId: number;
  list: { id: number; qty: string }[];
};

const intl = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2 });

export default function DataTable({ merchantId }: Props) {
  const products = useQuery({
    queryKey: ["products", merchantId],
    queryFn: () =>
      ky
        .post("/api/product/list", { json: { merchantId } })
        .json<{ list: TProduct[] }>(),
    enabled: merchantId >= 0,
  });

  const [qtyMap, quantity] = useMap<number, string>();

  const total = products.data?.list.reduce(
    (sum, cur) => sum + cur.price * parseFloat(quantity.get(cur.id) ?? "0"),
    0,
  );

  const nav = useNavigate();
  const client = useQueryClient();

  const orderAction = useMutation<any, any, SubmitOrders>({
    mutationFn: json => ky.post("/api/order/add", { json }).json(),
    onSuccess(obj) {
      if (!obj.error) {
        client.invalidateQueries({ queryKey: ["orders"] });
        client.invalidateQueries({ queryKey: ["orders-latest"] });
        nav("/orders");
      }
    },
  });

  const onSubmit = () => {
    const list = [...qtyMap.entries()].map(([k, v]) => ({ id: k, qty: v }));
    orderAction.mutate({ merchantId, list });
  };

  const role = useProfileStore(s => s.role);

  return (
    <>
      <table className="w-full tbl-headered tbl-spacious tbl-narrow-end">
        <thead>
          <tr className="border-muted-foreground border-b text-muted-foreground text-sm">
            <th className="py-3">Name</th>
            <th className="py-3 text-right">Price</th>
            <th className="py-3 text-right">Quantity</th>
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
              <tr key={item.id} className="odd:bg-muted">
                <td>{item.name}</td>
                <td className="text-right">{intl.format(item.price)}</td>
                <td>
                  <NumInput
                    value={quantity.get(item.id) || "0"}
                    setValue={num =>
                      parseFloat(num) <= 0
                        ? quantity.remove(item.id)
                        : quantity.set(item.id, num)
                    }
                    disabled={role !== "customer"}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {orderAction.data?.error ? (
        <div className="error-icon bg-destructive text-destructive-foreground p-2 text-sm rounded animate-zoom">
          orderAction.data?.error
        </div>
      ) : null}

      <div className="flex justify-end gap-2 md:gap-6 items-center px-2 md:px-4 bg-background border-foreground border-t py-4 md:py-6 sticky bottom-0">
        <div className="font-bold text-xl">
          Total: {intl.format(total ?? 0)}
        </div>
        <Button
          size="lg"
          disabled={qtyMap.size <= 0 || role !== "customer"}
          onClick={onSubmit}
        >
          Order
        </Button>
      </div>
    </>
  );
}
