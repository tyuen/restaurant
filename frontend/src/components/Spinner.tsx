export default function Spinner({ className = "w-4 h-4" }) {
  return (
    <div
      className={
        "rounded-full min-w-[.8rem] min-h-[.8rem] aspect-square border-crimson border-t-2 border-r-2 animate-spin " +
        className
      }
    ></div>
  );
}
