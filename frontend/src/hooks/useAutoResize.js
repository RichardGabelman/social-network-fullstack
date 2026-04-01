import { useCallback } from "react";

export function useAutoResize() {
  const ref = useCallback((el) => {
    if (!el) return;

    const resize = () => {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    };

    resize();
    el.addEventListener("input", resize);

    return () => el.removeEventListener("input", resize);
  }, []);

  return ref;
}