import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function NavGuest() {
  return (
    <>
      <Button asChild variant="outline">
        <Link to="/login">Login</Link>
      </Button>
      <Button asChild>
        <Link to="/register">Register</Link>
      </Button>
    </>
  );
}
