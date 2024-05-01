import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ky from "@/providers/ky";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from "@/components/Spinner";

export default function MerchantProfile() {
  const { register, handleSubmit, setValue, formState, watch } = useForm();

  //get list of merchant types
  const { data: types } = useQuery<{ list: { id: number; type: string }[] }>({
    queryKey: ["allMerchTypes"],
    queryFn: () => ky.get("/api/merchant/all-types").json(),
  });

  //get profile for current merchant
  const {
    error,
    isPending,
    data: profileData,
  } = useQuery({
    queryKey: ["merchProfile"],
    queryFn: () => ky.post("/api/merchant/profile").json(),
  });

  useEffect(() => {
    if (profileData) {
      setValue("name", profileData.merchant.name || "");
      setValue("address", profileData.merchant.address || "");
      setTypeId("" + profileData.merchant.type);
    }
  }, [profileData]);

  const [typeId, setTypeId] = useState("");
  const newType = watch("newType");

  const queryClient = useQueryClient();
  const nav = useNavigate();

  //save new merchant profile
  const mutation = useMutation<Record<string, string>>({
    mutationFn: json => ky.post("/api/merchant/set-profile", { json }).json(),
    onSuccess() {
      queryClient.invalidateQueries();
      nav("/");
    },
  });

  const onSubmit = obj => {
    mutation.mutate({ type: typeId, ...obj });
  };

  return (
    <main className="grow p-4 flex flex-col w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="p-2 max-w-sm w-full mx-auto">
          <CardHeader>
            <CardTitle>Restaurant Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <div className="text-sm">Restaurant Name</div>
            <Input
              placeholder="Name"
              className="w-full"
              disabled={isPending}
              {...register("name", {
                required: true,
                minLength: 2,
              })}
            />
            {formState.errors.name ? (
              <div className="text-xs text-destructive">
                Name must be at least 1 character.
              </div>
            ) : null}

            <div className="text-sm mt-4">Address</div>
            <Input
              placeholder="Address"
              className="w-full"
              disabled={isPending}
              {...register("address")}
            />

            <div className="text-sm mt-4">Cuisine Type</div>
            <Select
              value={typeId}
              onValueChange={setTypeId}
              disabled={isPending || newType?.length > 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {types?.list?.map(({ id, type }) => (
                    <SelectItem key={id} value={"" + id}>
                      {type}
                    </SelectItem>
                  ))}
                  {types?.list?.length ? null : (
                    <SelectItem value="0" disabled={true}>
                      None
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="mt-1">
              <div className="text-sm my-1">
                Or enter a custom Cuisine Type:
              </div>
              <Input
                placeholder="Type"
                className="w-full"
                disabled={isPending}
                {...register("newType")}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch">
            <Button
              type="submit"
              disabled={isPending || mutation.isPending}
              className="flex gap-2"
            >
              {mutation.isPending ? <Spinner /> : null}
              Save
            </Button>
            {error ? (
              <div className="error-icon bg-destructive text-destructive-foreground p-2 mt-2 text-sm rounded animate-zoom">
                {error.message}
              </div>
            ) : null}
          </CardFooter>
        </Card>
      </form>
    </main>
  );
}
