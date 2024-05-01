import { useQuery } from "@tanstack/react-query";
import ky from "@/providers/ky";

import Heading from "@/components/Heading";
import TilePanel from "../Home/TilePanel";

export default function Home() {
  const { isPending, data, error } = useQuery({
    queryKey: ["favorite"],
    queryFn: () => ky.post("/api/favorite/list").json(),
  });

  return (
    <main>
      <section className="p-4 max-w-screen-xl mx-auto">
        <Heading text="Favorites" />
        {error ? (
          <div className="text-center py-8">
            {error.message || error.toString()}
          </div>
        ) : (
          <TilePanel loading={isPending} items={data?.list} />
        )}
      </section>
    </main>
  );
}
