import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";

/**
 * Sdílitelný odkaz bez backendu: odpovědi se komprimovaně zakódují do hashe URL.
 * Formát je verzovaný, aby starší odkazy přežily budoucí změny otázek.
 * v2: sloučení otázek „data" a „systemy" do jedné — změnil se význam polí, takže starší
 * odkazy cíleně spadnou na „starší verze" místo chybného vykreslení.
 */
const VERSION = 2;

export function encodeAnswers(answers: unknown): string {
  return compressToEncodedURIComponent(JSON.stringify({ v: VERSION, a: answers }));
}

export type DecodeResult<T> = { ok: true; answers: T } | { ok: false; reason: "empty" | "version" | "corrupt" };

export function decodeAnswers<T>(hash: string): DecodeResult<T> {
  const raw = hash.replace(/^#?r=/, "").trim();
  if (!raw) return { ok: false, reason: "empty" };
  try {
    const json = decompressFromEncodedURIComponent(raw);
    if (!json) return { ok: false, reason: "corrupt" };
    const parsed = JSON.parse(json) as { v?: number; a?: T };
    if (parsed.v !== VERSION || parsed.a == null) return { ok: false, reason: "version" };
    return { ok: true, answers: parsed.a };
  } catch {
    return { ok: false, reason: "corrupt" };
  }
}
