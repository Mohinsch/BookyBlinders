import type { RefObject } from "react";
import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTORS = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "object",
  "embed",
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const isFocusable = (element: HTMLElement) =>
  element.matches(FOCUSABLE_SELECTORS) &&
  element.getClientRects().length > 0 &&
  getComputedStyle(element).visibility !== "hidden";

const getFocusableElements = (container: HTMLElement) =>
  Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
  ).filter(isFocusable);

export const useFocusTrap = (
  isActive: boolean,
  containerRef: RefObject<HTMLElement | null>,
) => {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;
    const container = containerRef.current;
    if (!container) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const focusableElements = getFocusableElements(container);
    const initialFocus = focusableElements[0] ?? container;
    initialFocus.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusable = getFocusableElements(container);
      if (focusable.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;

      if (event.shiftKey) {
        if (
          !activeElement ||
          activeElement === first ||
          !container.contains(activeElement)
        ) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      const previous = previousFocusRef.current;
      if (previous && document.contains(previous)) {
        previous.focus();
      }
    };
  }, [containerRef, isActive]);
};
