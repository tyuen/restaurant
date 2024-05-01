import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function NavGuest() {
  return (
    <nav className="flex gap-2 justify-end items-center animate-zoom">
      <Button asChild variant="outline" size="sm">
        <Link to="/login">Login</Link>
      </Button>
      <Button asChild size="sm">
        <Link to="/register">Register</Link>
      </Button>
    </nav>
  );
}
