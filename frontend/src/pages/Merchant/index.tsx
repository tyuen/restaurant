import { Navigate, useParams } from "react-router-dom";
import ky from "@/providers/ky";
import { useQuery } from "@tanstack/react-query";

import DataTable from "./DataTable";
import { Button } from "@/components/ui/button";
import { EarthIcon } from "lucide-react";

import type { TProduct } from "./types";

// const limit = 1000;

export default function Products() {
  const { id: merchantId } = useParams();

  const merchant = useQuery({
    queryKey: ["merchant", merchantId],
    queryFn: () =>
      ky.post("/api/merchant/get", { json: { id: merchantId } }).json(),
    enabled: merchantId >= 0,
  });

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

      <DataTable merchantId={merchantId} />
    </main>
  );
}
