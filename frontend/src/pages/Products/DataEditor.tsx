import { useEffect, type PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ky from "@/providers/ky";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/Spinner";

type Item = {
  id?: number;
  merchantId: number;
  name?: string;
  price?: number;
};

type Props = PropsWithChildren & {
  data: Item | null;
  onDone?: () => void;
};

const intl = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2 });

export default function DataEditor({ data, onDone }: Props) {
  const { register, handleSubmit, formState, reset, setValue } = useForm();

  useEffect(() => {
    reset();
    if (data) {
      setValue("name", data.name);
      setValue("price", intl.format(1 * (data.price ?? 0)));
    }
  }, [data]);

  const client = useQueryClient();

  const saveAction = useMutation({
    mutationFn: json => ky.post("/api/product/save-item", { json }).json(),
    onSuccess() {
      client.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const delAction = useMutation({
    mutationFn: json => ky.post("/api/product/del-item", { json }).json(),
    onSuccess() {
      client.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const onSubmit = obj => {
    if (data)
      saveAction.mutate({ ...obj, id: data.id, merchantId: data.merchantId });
  };

  const onDelete = () => {
    if (data) delAction.mutate({ id: data.id, merchantId: data.merchantId });
  };

  const off = !data || saveAction.isPending || delAction.isPending;

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="text-sm">Product Name</div>
      <Input
        placeholder="Name"
        className="w-full"
        disabled={off}
        autoFocus
        {...register("name", {
          required: true,
          minLength: 1,
        })}
      />
      <div className="text-sm">Unit Price</div>
      <Input
        placeholder="Price"
        className="w-full"
        disabled={off}
        {...register("price", {
          required: true,
          minLength: 1,
          pattern: /^[\d.,\s]+$/,
        })}
      />
      <div className="flex justify-between items-center gap-2 mt-2">
        <Button
          type="button"
          size="sm"
          onClick={onDelete}
          variant="destructive"
          disabled={off || !data?.id}
        >
          Delete
        </Button>
        {off ? <Spinner /> : null}
        <Button type="submit" size="sm" disabled={off || !formState.isDirty}>
          Save
        </Button>
      </div>
    </form>
  );
}
