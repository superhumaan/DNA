/**
 * DNA Browser Runtime — frontend error watching (on by default)
 * Import once in your app entry (main.tsx / layout.tsx).
 */
const DNA_RUNTIME_ENDPOINT = import.meta.env.VITE_DNA_RUNTIME_URL ?? "/api/dna/runtime";

export function initDnaBrowserRuntime(options?: { projectId?: string }): void {
  if (typeof window === "undefined") return;

  const projectId = options?.projectId ?? import.meta.env.VITE_DNA_PROJECT_ID ?? "app";

  const report = (payload: Record<string, unknown>) => {
    fetch(DNA_RUNTIME_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, projectId, source: "browser" }),
      keepalive: true,
    }).catch(() => {});
  };

  window.addEventListener("error", (event) => {
    report({
      type: "uncaught_exception",
      message: event.message,
      stack: event.error?.stack,
      filename: event.filename,
      lineno: event.colno,
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    report({
      type: "unhandled_rejection",
      message: reason instanceof Error ? reason.message : String(reason),
      stack: reason instanceof Error ? reason.stack : undefined,
    });
  });
}
