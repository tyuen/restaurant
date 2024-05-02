import { useEffect } from "react";
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

import Spinner from "@/components/Spinner";

export default function CustomerProfile() {
  const { register, handleSubmit, setValue, formState } = useForm();

  const {
    error,
    isPending,
    data: profileData,
  } = useQuery<any>({
    queryKey: ["custProfile"],
    queryFn: () => ky.post("/api/customer/profile").json(),
  });

  useEffect(() => {
    if (profileData) {
      setValue("name", profileData?.customer?.name || "");
      setValue("email", profileData?.customer?.email || "");
    }
  }, [profileData]);

  const queryClient = useQueryClient();
  const nav = useNavigate();

  //save new merchant profile
  const mutation = useMutation<Record<string, string>>({
    mutationFn: json => ky.post("/api/customer/set-profile", { json }).json(),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["custProfile"] });
      nav("/");
    },
  });

  const onSubmit = (obj: any) => {
    mutation.mutate(obj);
  };

  return (
    <main className="grow p-4 flex flex-col w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="p-2 max-w-sm w-full mx-auto">
          <CardHeader>
            <CardTitle>Customer Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <div className="text-sm">Personal Name</div>
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

            <div className="text-sm mt-4">Email Address</div>
            <Input
              type="email"
              placeholder="Email"
              className="w-full"
              disabled={isPending}
              {...register("email")}
            />
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
