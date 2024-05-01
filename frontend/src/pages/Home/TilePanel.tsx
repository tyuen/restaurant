import { type PropsWithChildren } from "react";
import Tile from "./Tile";
import { cx } from "class-variance-authority";
import { Skeleton } from "@/components/ui/skeleton";

type Item = {
  id: number;
  name: string;
  address: string;
  type: {
    id: number;
    type: string;
  };
};

type Prop = PropsWithChildren & {
  loading: boolean;
  className?: string;
  items: Item[];
};

export default function TilePanel({ loading, items, className = "" }: Prop) {
  return (
    <div
      className={cx(
        "grid grid-cols-1 sm:grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {loading
        ? Array(12)
            .fill(null)
            .map((_, i) => <Skeleton key={i} className="h-60" />)
        : items.map(i => <Tile key={i.id} item={i} />)}
    </div>
  );
}
