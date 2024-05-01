import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import LogoutButton from "./LogoutButton";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/orders", label: "Orders" },
  { to: "/profile", label: "Profile" },
];

export default function NavCustomer() {
  return (
    <nav className="flex gap-2 justify-end items-center animate-zoom">
      {links.map((i, idx) => (
        <Button key={idx} asChild variant="ghost">
          <Link to={i.to} className="hidden sm:inline-flex">
            {i.label}
          </Link>
        </Button>
      ))}
      <LogoutButton className="hidden sm:inline-flex" />

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="sm:hidden">
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-2">
          {links.map((i, idx) => (
            <SheetClose key={idx} asChild>
              <Button asChild variant="ghost">
                <Link to={i.to}>{i.label}</Link>
              </Button>
            </SheetClose>
          ))}
          <LogoutButton />
        </SheetContent>
      </Sheet>
    </nav>
  );
}
