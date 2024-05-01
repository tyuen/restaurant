import type { SetStateAction, Dispatch, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type Props = PropsWithChildren & {
  className?: string;
  value: string;
  setValue: (v: string) => void;
  disabled?: boolean;
};

export default function NumInput({
  className,
  value,
  setValue,
  disabled = false,
}: Props) {
  const inc = () => {
    setValue("" + (parseFloat(value ?? 0) + 1));
  };
  const dec = () => {
    const i = parseFloat(value);
    setValue("" + (i > 0 ? i - 1 : 0));
  };
  return (
    <div
      className={twMerge(
        "flex items-stretch border rounded-md border-muted-foreground overflow-hidden",
        className,
      )}
    >
      <button
        className="bg-primary text-primary-foreground px-2 disabled:opacity-50"
        onClick={inc}
        disabled={disabled}
      >
        +
      </button>
      <input
        className="bg-transparent py-1 text-center w-8 sm:w-12 disabled:opacity-50 disabled:cursor-not-allowed"
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={disabled}
      />
      <button
        className="bg-primary text-primary-foreground px-2 disabled:opacity-50"
        onClick={dec}
        disabled={disabled}
      >
        &minus;
      </button>
    </div>
  );
}
