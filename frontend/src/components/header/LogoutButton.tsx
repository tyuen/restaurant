import { useMutation } from "@tanstack/react-query";
import { useProfileStore } from "@/providers/profile";
import ky from "@/providers/ky";

import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export default function LogoutButton({ className = "" }) {
  const nav = useNavigate();

  const userName = useProfileStore(s => s.userName);
  const setProfile = useProfileStore(s => s.setProfile);

  const { isPending, mutate } = useMutation<Record<string, string>>({
    mutationFn: userName =>
      ky.post("/api/auth/logout", { json: { userName } }).json(),
    onSettled: obj => {
      if (obj?.status === "ok") {
        setProfile({ id: -1, userName: "", role: "" });
        nav("/");
      }
    },
  });
  const handle = e => mutate(userName);
  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={handle}
      className={className}
    >
      Logout
    </Button>
  );
}
