// Client-side helpers for consuming the assistant's streamed text response.
// Shared by every chat surface (floating widget + Contact page panel).

import { LEAD_COMPLETE_MARKER } from "./types";

/** Remove the completion marker (and any trailing partial of it) for display. */
export function stripMarker(text: string): string {
  const idx = text.indexOf(LEAD_COMPLETE_MARKER);
  if (idx !== -1) return text.slice(0, idx).trimEnd();
  // Hide a partially-streamed marker tail like "[[LEAD_QUAL".
  return text.replace(/\s*\[\[?[A-Z_]*$/, "");
}

/**
 * Read a `text/plain` streaming Response, invoking `onDelta` with the cumulative
 * text after each chunk. Returns the full text once the stream closes.
 */
export async function readTextStream(
  res: Response,
  onDelta: (full: string) => void,
): Promise<string> {
  if (!res.body) {
    const text = await res.text();
    onDelta(text);
    return text;
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    full += decoder.decode(value, { stream: true });
    onDelta(full);
  }
  full += decoder.decode();
  onDelta(full);
  return full;
}
