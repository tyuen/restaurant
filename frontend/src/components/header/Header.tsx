import { Link } from "react-router-dom";
import { useProfileStore } from "@/providers/profile";

import NavGuest from "./NavGuest";
import NavCustomer from "./NavCustomer";
import NavMerchant from "./NavMerchant";

import Spinner from "../Spinner";
import { GhostIcon } from "lucide-react";

export default function Header() {
  const loading = useProfileStore(s => s.loading);
  const role = useProfileStore(s => s.role);

  return (
    <header className="bg-background p-2 md:py-4">
      <div className="mx-auto max-w-screen-lg flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl hover:underline focus:underline flex items-center gap-1"
        >
          <GhostIcon className="w-6 h-6" />
          Restaurant
        </Link>
        {loading ? (
          <Spinner className="h-5 border-muted-foreground" />
        ) : !role ? (
          <NavGuest />
        ) : role === "merchant" ? (
          <NavMerchant />
        ) : (
          <NavCustomer />
        )}
      </div>
    </header>
  );
}
