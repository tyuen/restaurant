import { cn } from "@/lib/utils";
import { type PropsWithChildren } from "react";
import { Link } from "react-router-dom";

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
  className?: string;
  item: Item;
};

export default function Tile({ item, className = "" }: Prop) {
  return (
    <Link
      to={"/shop/" + item.id}
      className={cn(
        "flex flex-col items-stretch hover:bg-muted h-60 sm:h-72 border border-muted-foreground rounded-lg",
        className,
      )}
    >
      <img
        src={`https://picsum.photos/seed/${item.id}/500/500`}
        className="object-cover flex-1 min-h-0 rounded-t-lg"
      />
      <div className="p-2 sm:px-4">
        <div className="text-lg font-bold">{item.name}</div>
        <div className="text-sm text-muted-foreground">{item.type?.type}</div>
      </div>
    </Link>
  );
}
