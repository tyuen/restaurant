import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import LogoutButton from "./LogoutButton";

export default function NavCustomer() {
  return (
    <nav className="flex gap-2 justify-end items-center animate-zoom">
      <Button asChild variant="ghost">
        <Link to="/">Home</Link>
      </Button>

      <Button asChild variant="ghost">
        <Link to="/orders">Orders</Link>
      </Button>

      <Button asChild variant="ghost">
        <Link to="/profile">Profile</Link>
      </Button>

      <LogoutButton />
    </nav>
  );
}
