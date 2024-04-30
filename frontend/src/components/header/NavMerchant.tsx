import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import LogoutButton from "./LogoutButton";

export default function NavMerchant() {
  return (
    <>
      <Button asChild variant="ghost">
        <Link to="/products">Products</Link>
      </Button>

      <Button asChild variant="ghost">
        <Link to="/profile">Profile</Link>
      </Button>

      <LogoutButton />
    </>
  );
}
