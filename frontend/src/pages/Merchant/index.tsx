import { Navigate, useParams } from "react-router-dom";
import ky from "@/providers/ky";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import DataTable from "./DataTable";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { EarthIcon, HeartIcon } from "lucide-react";

import type { TMerchant } from "./types";
import { useProfileStore } from "@/providers/profile";

type SubmitFavorite = {
  merchantId: number;
  state: boolean;
};

// const limit = 1000;

export default function Products() {
  const { id } = useParams();
  const merchantId = Number(id || "-1");

  const merchant = useQuery<any, any, TMerchant>({
    queryKey: ["merchant", merchantId],
    queryFn: () =>
      ky.post("/api/merchant/get", { json: { id: merchantId } }).json(),
    enabled: merchantId >= 0,
  });

  const favorite = useQuery<any>({
    queryKey: ["favorite", merchantId],
    queryFn: () =>
      ky.post("/api/favorite/check-merchant", { json: { merchantId } }).json(),
    enabled: merchantId >= 0,
  });

  const client = useQueryClient();

  const favoriteAction = useMutation<any, any, SubmitFavorite>({
    mutationFn: json => ky.post("/api/favorite/set-merchant", { json }).json(),
    onSettled() {
      client.invalidateQueries({ queryKey: ["favorite"] });
    },
  });
  const toggleFavorite = () => {
    favoriteAction.mutate({
      merchantId,
      state: !!favorite.data?.isEmpty,
    });
  };

  const role = useProfileStore(s => s.role);

  if (!(merchantId > 0)) return <Navigate to="/" />;

  return (
    <main className="max-w-screen-lg w-full mx-auto p-2">
      <section className="flex gap-4 my-4 items-center">
        <EarthIcon className="w-20 h-20 p-1 bg-muted text-muted-foreground rounded-md" />
        <div>
          <h1 className="text-3xl font-bold flex gap-1 items-center">
            {merchant.data?.name ?? "-"}
            {role !== "customer" ? null : favorite.isPending ? (
              <Spinner className="ml-3" />
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFavorite}
                disabled={favoriteAction.isPending}
                title={favoriteAction.data?.error ?? null}
              >
                {favorite.data?.isEmpty ? (
                  <HeartIcon className="text-muted-foreground/30" />
                ) : (
                  <HeartIcon className="text-red-500 fill-red-500" />
                )}
              </Button>
            )}
          </h1>
          <div className="text-muted-foreground">
            {merchant.data?.address ?? "-"}
          </div>
        </div>
      </section>

      <DataTable merchantId={merchantId} />
    </main>
  );
}
