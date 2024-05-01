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

const GRID =
  "grid grid-cols-1 sm:grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4 min-h-[50vh]";

export default function TilePanel({ loading, items, className = "" }: Prop) {
  return loading ? (
    <div className={cx(GRID, className)}>
      {Array(12)
        .fill(null)
        .map((_, i) => (
          <Skeleton key={i} className="h-60" />
        ))}
    </div>
  ) : !items?.length ? (
    <div className="border border-muted text-muted-foreground py-16 sm:py-28 text-center">
      No items found.
    </div>
  ) : (
    <div className={cx(GRID, className)}>
      {items?.map(i => (
        <Tile key={i.id} item={i} />
      ))}
    </div>
  );
}
