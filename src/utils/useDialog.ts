import { useEffect, useRef } from 'react';

// Shared keyboard behavior for room popups and the welcome window.
export function useDialog(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const previous = document.activeElement as HTMLElement | null;
    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input, textarea, select, [tabindex="0"]'
    )).filter(el => el.getClientRects().length > 0);
    (focusable()[0] ?? dialog).focus();
    const isTopmost = () => Array.from(document.querySelectorAll('[role="dialog"]')).at(-1) === dialog;
    const onKey = (event: KeyboardEvent) => {
      if (!isTopmost()) return;
      if (event.key === 'Escape') {
        event.stopImmediatePropagation();
        event.preventDefault();
        closeRef.current();
      } else if (event.key === 'Tab') {
        const items = focusable();
        const first = items[0] ?? dialog;
        const last = items.at(-1) ?? dialog;
        if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
          event.preventDefault(); first.focus();
        }
      }
    };
    const onFocus = (event: FocusEvent) => {
      if (isTopmost() && !dialog.contains(event.target as Node)) (focusable()[0] ?? dialog).focus();
    };
    window.addEventListener('keydown', onKey, true);
    document.addEventListener('focusin', onFocus);
    return () => {
      window.removeEventListener('keydown', onKey, true);
      document.removeEventListener('focusin', onFocus);
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  return ref;
}
