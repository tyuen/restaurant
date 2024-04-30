import { Navigate } from "react-router-dom";
import { useProfileStore } from "@/providers/profile";
import Spinner from "@/components/Spinner";
import Merchant from "./Merchant";
import Customer from "./Customer";

export default function Login() {
  const loading = useProfileStore(s => s.loading);
  const role = useProfileStore(s => s.role);

  return (
    <main className="grow p-4 flex flex-col items-center">
      <div className="grow"></div>
      {loading ? (
        <Spinner className="h-8 border-muted-foreground" />
      ) : role === "merchant" ? (
        <Merchant />
      ) : role === "customer" ? (
        <Customer />
      ) : (
        <Navigate to="/login" />
      )}
      <div className="grow"></div>
    </main>
  );
}
