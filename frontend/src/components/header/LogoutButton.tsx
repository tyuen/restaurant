import { useMutation } from "@tanstack/react-query";
import { useProfileStore } from "@/providers/profile";
import ky from "@/providers/ky";

import { Button } from "../ui/button";

export default function LogoutButton() {
  const userName = useProfileStore(s => s.userName);
  const setProfile = useProfileStore(s => s.setProfile);

  const { isPending, mutate } = useMutation<Record<string, string>>({
    mutationFn: userName =>
      ky.post("/api/auth/logout", { json: { userName } }).json(),
    onSettled: obj => {
      if (obj?.status === "ok") setProfile("", "");
    },
  });
  const handle = e => mutate(userName);
  return (
    <Button variant="outline" disabled={isPending} onClick={handle}>
      Logout
    </Button>
  );
}
