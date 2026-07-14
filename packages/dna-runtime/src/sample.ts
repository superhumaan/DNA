import type { RuntimeEvent } from "@superhumaan/dna-config";

/** Persist a full event at most once per fingerprint within this window (after the first). */
export const EVENT_SAMPLE_COOLDOWN_MS = 60_000;

const lastFullWrite = new Map<string, number>();

export interface SampleDecision {
  /** Persist the event row to runtime.db */
  persistEvent: boolean;
  /** Always upsert issue + fingerprint */
  upsertIssue: boolean;
  sampled: boolean;
}

/**
 * Anti-spam: first hit always persists; later hits bump counts but only
 * persist a full event after cooldown (or when status/severity-critical path).
 */
export function decideEventSample(
  fingerprint: string,
  options?: { force?: boolean; now?: number },
): SampleDecision {
  const now = options?.now ?? Date.now();
  const last = lastFullWrite.get(fingerprint);

  if (options?.force || last == null) {
    lastFullWrite.set(fingerprint, now);
    return { persistEvent: true, upsertIssue: true, sampled: false };
  }

  if (now - last >= EVENT_SAMPLE_COOLDOWN_MS) {
    lastFullWrite.set(fingerprint, now);
    return { persistEvent: true, upsertIssue: true, sampled: true };
  }

  return { persistEvent: false, upsertIssue: true, sampled: true };
}

export function resetSampleStateForTests(): void {
  lastFullWrite.clear();
}

export function markEventSampled(event: RuntimeEvent, sampled: boolean): RuntimeEvent {
  return sampled ? { ...event, sampled: true } : event;
}
