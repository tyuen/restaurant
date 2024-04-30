import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import ky from "@/providers/ky";

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
import { useProfileStore } from "@/providers/profile";

export default function Register() {
  const [params] = useSearchParams();
  const role = params.get("role");

  const { register, handleSubmit, formState, watch } = useForm();

  const store = useProfileStore();
  const nav = useNavigate();

  const pwdMatch = watch(["password", "password2"]);

  const { error, isPending, data, mutate } = useMutation<
    Record<string, string>
  >({
    mutationFn: json => ky.post("/api/auth/register", { json }).json(),
    onSettled: obj => {
      if (obj && !obj.error) {
        store.setProfile(obj);
        nav("/");
      }
    },
  });

  const onSubmit = obj => {
    if (role === "merchant") {
      mutate({ ...obj, role: "merchant" });
    } else {
      mutate({ ...obj, role: "customer" });
    }
  };

  return (
    <main
      className="grow p-4 flex flex-col"
      style={{
        background:
          "url(https://picsum.photos/id/866/1024/768) center/cover no-repeat",
      }}
    >
      <div className="grow"></div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="p-2 max-w-sm w-full mx-auto">
          <CardHeader>
            <CardTitle>
              {role === "merchant"
                ? "Restaurant Registration"
                : "Customer Registration"}
            </CardTitle>
            <CardDescription>
              Register for an account on the Restaurant Ordering System
            </CardDescription>
          </CardHeader>
          <CardContent>
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
            <div
              className={
                "text-xs mt-2 " +
                (formState.errors.userName
                  ? "text-destructive"
                  : "text-muted-foreground")
              }
            >
              Username must start with a letter and be at least 4 characters
            </div>

            <Input
              placeholder="Password"
              type="password"
              disabled={isPending}
              className="w-full mt-4"
              {...register("password", { minLength: 8, required: true })}
            />
            <div
              className={
                "text-xs mt-2 " +
                (formState.errors.password
                  ? "text-destructive"
                  : "text-muted-foreground")
              }
            >
              Password must be at least 8 characters
            </div>

            <Input
              placeholder="Re-type Password"
              type="password"
              disabled={isPending}
              className="w-full mt-4"
              {...register("password2", { required: true })}
            />
            <div
              className={
                "text-xs mt-2 " +
                (pwdMatch[0] != pwdMatch[1]
                  ? "text-destructive"
                  : "text-muted-foreground")
              }
            >
              Retype the same password again.
            </div>

            {data?.error ? (
              <div className="error-icon bg-destructive text-destructive-foreground p-2 mt-4 text-sm rounded animate-zoom">
                {data.error === "taken"
                  ? "This username is taken."
                  : data.error}
              </div>
            ) : null}
          </CardContent>
          <CardFooter className="flex flex-col items-stretch">
            <Button
              type="submit"
              disabled={
                isPending || (pwdMatch[0] && pwdMatch[0] !== pwdMatch[1])
              }
            >
              {role === "merchant"
                ? "Register as Restaurant Owner"
                : "Register as Customer"}
            </Button>
            {error ? (
              <div className="error-icon bg-destructive text-destructive-foreground p-2 mt-2 text-sm rounded animate-zoom">
                {error.message}
              </div>
            ) : null}
            <Button variant="secondary" asChild>
              <Link
                to={
                  role === "merchant" ? "/register" : "/register?role=merchant"
                }
                className="mt-4"
              >
                {role === "merchant"
                  ? "Want to register as a customer?"
                  : "Restaurant owner? Register here."}
              </Link>
            </Button>

            <Button variant="ghost" asChild>
              <Link to="/login" className="mt-4">
                Login
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </form>
      <div className="grow"></div>
    </main>
  );
}
