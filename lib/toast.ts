export type ToastItem = { id: number; text: string };

const listeners = new Set<(t: ToastItem) => void>();
let nextId = 0;

export function toast(text: string) {
  const item = { id: ++nextId, text };
  listeners.forEach((fn) => fn(item));
}

export function subscribeToasts(fn: (t: ToastItem) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
