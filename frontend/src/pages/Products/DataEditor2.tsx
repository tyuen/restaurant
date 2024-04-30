import { type PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import ky from "@/providers/ky";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Item = {
  id: number;
  merchantId: number;
  name: string;
  price: number;
};

type Props = PropsWithChildren & {
  data?: Partial<Item> | null;
  onClose: () => void;
};

export default function DataEditor({ data, onClose }: Props) {
  const { register, handleSubmit } = useForm();

  const { isPending, mutate } = useMutation({
    mutationFn: obj => ky.post("/api/product/set-item", { json: obj }),
  });

  const onSubmit = obj => {
    // mutate({ ...obj, id: data?.id, merchantId: data?.merchantId });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Dialog open={!!data} onOpenChange={b => !b && onClose()} modal={true}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <div className="text-sm">Product Name</div>
            <Input
              placeholder="Name"
              className="w-full"
              disabled={isPending}
              {...register("name", {
                required: true,
                minLength: 1,
              })}
            />
            <div className="text-sm mt-4">Unit Price</div>
            <Input
              placeholder="Price"
              className="w-full"
              disabled={isPending}
              {...register("price", {
                required: true,
                minLength: 1,
              })}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="destructive" disabled={isPending}>
                Delete
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" disabled={isPending}>
                Save
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}
