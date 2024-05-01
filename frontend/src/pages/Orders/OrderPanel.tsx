import type { PropsWithChildren } from "react";
import type { TOrder } from "./types";
import { Link } from "react-router-dom";

type Props = PropsWithChildren & {
  className?: string;
  order: TOrder;
  showTotal?: boolean;
};

const intl = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2 });

export default function OrderPanel({ order, showTotal = false }: Props) {
  return (
    <div>
      <div className="my-2 px-2 sm:flex justify-between">
        <div>
          <div className="text-lg font-bold">
            <Link to={"/merchant/" + order.id} className="underline">
              {order.merchant?.name}
            </Link>
          </div>
          <div className="text-sm">{order.merchant?.address}</div>
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground">
          Ordered: {new Date(order.createdAt).toLocaleString()}
        </div>
      </div>
      <table className="w-full tbl-headered tbl-spacious tbl-narrow-end">
        <thead>
          <tr className="border-muted-foreground border-b text-muted-foreground text-sm">
            <th className="py-3">Name</th>
            <th className="py-3 text-right">Price</th>
            <th className="py-3 text-right">Quantity</th>
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
                <td className="text-right">{intl.format(item.price)}</td>
                <td>{item.quantity}</td>
              </tr>
            ))
          )}
        </tbody>
        {showTotal ? (
          <tfoot>
            <tr className="border-muted-foreground border-t">
              <th className="py-3">Total</th>
              <th className="py-3 text-right">
                {order.items?.reduce((sum, i) => sum + i.price * i.quantity, 0)}
              </th>
              <th className="py-3 text-right">{order.items?.length}</th>
            </tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  );
}
