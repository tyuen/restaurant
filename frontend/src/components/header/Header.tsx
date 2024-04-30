import { Link } from "react-router-dom";
import { useProfileStore } from "@/providers/profile";

import NavGuest from "./NavGuest";
import NavCustomer from "./NavCustomer";
import NavMerchant from "./NavMerchant";

import Spinner from "../Spinner";

export default function Header() {
  const loading = useProfileStore(s => s.loading);
  const role = useProfileStore(s => s.role);

  return (
    <header className="bg-background p-2 md:py-4">
      <div className="mx-auto max-w-screen-lg flex items-center">
        <Link to="/" className="text-2xl">
          Restaurant
        </Link>
        <nav className="grow flex gap-2 justify-end items-center">
          {loading ? (
            <Spinner className="h-5 border-muted-foreground" />
          ) : !role ? (
            <NavGuest />
          ) : role === "merchant" ? (
            <NavMerchant />
          ) : (
            <NavCustomer />
          )}
        </nav>
      </div>
    </header>
  );
}
