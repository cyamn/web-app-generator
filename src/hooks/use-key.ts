import { useEffect, useRef } from "react";

export function useKey(key: string, callback_: (event: KeyboardEvent) => void) {
  const callback = useRef(callback_);

  useEffect(() => {
    callback.current = callback_;
  });

  useEffect(() => {
    function handle(event: KeyboardEvent) {
      if (event.code === key) {
        callback.current(event);
      } else if (key === "ctrls" && event.key === "s" && event.ctrlKey) {
        event.preventDefault();
        callback.current(event);
      }
    }

    document.addEventListener("keydown", handle);
    return () => {
      document.removeEventListener("keydown", handle);
    };
  }, [key]);
}
