import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type Props = PropsWithChildren & {
  text?: string;
  className?: string;
};
export default function Heading({
  text = "",
  className = "",
  children,
}: Props) {
  return (
    <h1
      className={twMerge(
        "text-3xl border-b pb-3 font-bold my-6 px-2 flex flex-col sm:flex-row items-end sm:items-center gap-1 justify-between",
        className,
      )}
    >
      <div className="self-start">{text}</div>
      {children}
    </h1>
  );
}
