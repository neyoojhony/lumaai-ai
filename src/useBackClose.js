import { useEffect, useRef } from "react";

/**
 * Makes an overlay / dropdown / menu closable via the phone's back button
 * (like Claude's app) — instead of the back button immediately leaving
 * the site.
 *
 * Usage:
 *   const [open, setOpen] = useState(false);
 *   useBackClose(open, () => setOpen(false));
 *
 * When `open` becomes true, a history entry is pushed. Pressing back
 * pops it and calls onClose(). Closing the menu any other way (clicking
 * outside, picking an option) just leaves that entry inert — the next
 * back press consumes it with no visible effect, which is a fine
 * tradeoff for a lightweight menu.
 */
export function useBackClose(isOpen, onClose) {
  const pushedRef = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (isOpen && !pushedRef.current) {
      window.history.pushState({ lumaOverlay: true }, "");
      pushedRef.current = true;
    }
    if (!isOpen) {
      pushedRef.current = false;
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = () => {
      if (pushedRef.current) {
        pushedRef.current = false;
        onCloseRef.current();
      }
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);
}
