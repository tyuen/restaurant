import type { PropsWithChildren } from "react";
import type { TOrder } from "./types";
import Spinner from "@/components/Spinner";

type Props = PropsWithChildren & {
  className?: string;
  order: TOrder;
};

const intl = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 });

export default function OrderPanel({ order }: Props) {
  return (
    <div>
      <div>
        <div className="text-lg font-bold">{order.merchant?.name}</div>
        <div className="text-sm">{order.merchant?.address}</div>
      </div>
      <table className="w-full tbl-headered tbl-spacious tbl-narrow-end">
        <thead>
          <tr className="border-muted-foreground border-b">
            <th className="py-3">Name</th>
            <th className="py-3">Price</th>
            <th className="py-3">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {order.items?.length === 0 ? (
            <tr>
              <td colSpan={3}>
                <div className="my-12 sm:my-20 text-center text-muted-foreground">
                  No items.
                </div>
              </td>
            </tr>
          ) : (
            order.items?.map(item => (
              <tr key={item.id}>
                <td>{item.product?.name}</td>
                <td>{intl.format(item.price)}</td>
                <td>{item.quantity}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
