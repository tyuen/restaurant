import { useRef, useState } from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useReRender() {
  const [_, set] = useState(0);
  return useRef(() => set(i => i + 1)).current;
}
