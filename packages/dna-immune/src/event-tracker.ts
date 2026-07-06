import type { RuntimeEvent } from "@humaan/dna-config";

interface TrackedEvent {
  timestamp: number;
  event: RuntimeEvent;
}

const WINDOW_MS = 5 * 60 * 1000;

export class EventTracker {
  private buckets = new Map<string, TrackedEvent[]>();

  record(key: string, event: RuntimeEvent): number {
    const now = Date.now();
    const existing = this.buckets.get(key) ?? [];
    const inWindow = existing.filter((e) => now - e.timestamp < WINDOW_MS);
    inWindow.push({ timestamp: now, event });
    this.buckets.set(key, inWindow);
    return inWindow.length;
  }

  countInWindow(key: string): number {
    const now = Date.now();
    const existing = this.buckets.get(key) ?? [];
    return existing.filter((e) => now - e.timestamp < WINDOW_MS).length;
  }

  reset(): void {
    this.buckets.clear();
  }
}

export function eventKey(event: RuntimeEvent): string {
  return `${event.type}:${event.endpoint ?? "global"}:${event.message.slice(0, 40)}`;
}
