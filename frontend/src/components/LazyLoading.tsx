import Spinner from "./Spinner";

export default function LazyLoading() {
  return (
    <div aria-busy="true" className="flex items-center justify-center grow">
      <Spinner className="w-6" />
    </div>
  );
}
