import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ky from "@/providers/ky";
import { useProfileStore } from "@/providers/profile";

export default function Login() {
  const { register, handleSubmit, formState } = useForm();

  const setProfile = useProfileStore(s => s.setProfile);
  const nav = useNavigate();

  const { error, isPending, data, mutate } = useMutation<
    Record<string, string>
  >({
    mutationFn: json => ky.post("/api/auth/login", { json }).json(),
    onSuccess: obj => {
      if (!obj.error) {
        setProfile(obj);
        nav("/");
      }
    },
  });

  const onSubmit = (obj: any) => mutate(obj);

  return (
    <main className="grow p-4 flex flex-col bg-stone-100">
      <div className="grow"></div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="p-2 max-w-sm w-full mx-auto">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Login to the Restaurant Ordering System
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Username"
              className="w-full"
              autoFocus
              disabled={isPending}
              {...register("userName", {
                required: true,
                minLength: 4,
                pattern: /^[a-z][a-z0-9]{3,20}$/,
              })}
            />
            {formState.errors.userName && (
              <div className="bg-destructive text-destructive-foreground error-icon p-2 text-sm rounded animate-zoom">
                Username must start with a letter and be at least 4 characters
              </div>
            )}

            <Input
              placeholder="Password"
              type="password"
              disabled={isPending}
              className="w-full"
              {...register("password", { minLength: 8, required: true })}
            />
            {formState.errors.password && (
              <div className="error-icon bg-destructive text-destructive-foreground p-2 text-sm rounded animate-zoom">
                Password must be at least 8 characters
              </div>
            )}
            {data?.error === "mismatch" ? (
              <div className="error-icon bg-destructive text-destructive-foreground p-2 text-sm rounded animate-zoom">
                Incorrect username or password
              </div>
            ) : null}
          </CardContent>
          <CardFooter className="flex flex-col items-stretch">
            <Button type="submit" disabled={isPending}>
              Login
            </Button>
            {error ? (
              <div className="error-icon bg-destructive text-destructive-foreground p-2 mt-2 text-sm rounded animate-zoom">
                {error.message}
              </div>
            ) : null}
            <Button variant="outline" asChild>
              <Link to="/register" className="mt-8">
                Register a new Account
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </form>
      <div className="grow"></div>
    </main>
  );
}
