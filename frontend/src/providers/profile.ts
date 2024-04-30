import { create } from "zustand";
import ky from "./ky";

type Profile = {
  loading: boolean;
  id: number;
  userName: string;
  role: string;
  setLoading: (b: boolean) => void;
  setProfile: (o: { id: number; userName: string; role: string }) => void;
};

export const useProfileStore = create<Profile>(set => ({
  loading: true,

  id: -1,
  userName: "",
  role: "",

  setLoading(loading) {
    set({ loading });
  },

  setProfile(obj) {
    set(obj);
  },
}));

ky.post("/api/auth/me")
  .json<any>()
  .then(
    data => {
      useProfileStore.setState({
        loading: false,
        id: data?.id ?? -1,
        userName: data?.userName ?? "",
        role: data?.role ?? "",
      });
    },
    () => useProfileStore.setState({ loading: false }),
  );
