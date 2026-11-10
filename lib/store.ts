"use client";
import { useEffect, useState } from "react";
import { artworks as seed, type Artwork } from "@/lib/data";

// Demo storage: browser localStorage. Swap read/write for Supabase later.
const KEY = "yk_artworks_v1";

function read(): Artwork[] {
  try {
    const r = localStorage.getItem(KEY);
    if (r) return JSON.parse(r) as Artwork[];
  } catch {}
  return seed;
}
function write(a: Artwork[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(a));
  } catch {}
  window.dispatchEvent(new Event("yk-store"));
}

export const listArtworks = read;

/** Create or update. `originalSlug` is the slug before editing (undefined when creating). */
export function saveArtwork(a: Artwork, originalSlug?: string): string | null {
  const all = read();
  if (all.some((x) => x.slug === a.slug && x.slug !== originalSlug)) return "Slug is already used by another artwork.";
  const next = originalSlug && all.some((x) => x.slug === originalSlug) ? all.map((x) => (x.slug === originalSlug ? a : x)) : [...all, a];
  write(next);
  return null;
}
export function deleteArtwork(slug: string) {
  write(read().filter((x) => x.slug !== slug));
}
export function resetArtworks() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  window.dispatchEvent(new Event("yk-store"));
}

export function useArtworks() {
  const [arts, setArts] = useState<Artwork[]>(seed);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => {
      setArts(read());
      setReady(true);
    };
    sync();
    window.addEventListener("yk-store", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("yk-store", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return { arts, ready };
}
