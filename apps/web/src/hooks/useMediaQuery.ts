import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string): boolean {
  const mq = typeof window !== "undefined" ? window.matchMedia(query) : null;
  return useSyncExternalStore(
    (cb) => {
      mq?.addEventListener("change", cb);
      return () => mq?.removeEventListener("change", cb);
    },
    () => mq?.matches ?? true,
    () => true,
  );
}
