import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    const n: HTMLMetaElement =
      document.querySelector('meta[name="robots"]') ||
      document.head.appendChild(document.createElement("meta"));
    n.name = "robots";
    n.content = "noindex";
    return () => n.remove();
  }, []);
  return (
    <main className="flex gap-3 flex-col items-center justify-center flex-1 p-3 text-xl text-center min-h-[80vh]">
      <div>404 Not Found</div>
    </main>
  );
}
