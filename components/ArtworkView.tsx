"use client";
import Link from "next/link";
import SlidePlayer from "@/components/SlidePlayer";
import { useArtworks } from "@/lib/store";

export default function ArtworkView({ slug }: { slug: string }) {
  const { arts, ready } = useArtworks();
  const art = arts.find((a) => a.slug === slug);
  if (!art)
    return (
      <main className="flex h-dvh flex-col items-center justify-center gap-3 bg-stone-950 text-stone-100">
        {ready ? (
          <>
            <p>Artwork not found.</p>
            <Link href="/karya" className="text-amber-400 underline">Back to artworks</Link>
          </>
        ) : (
          <p className="text-stone-400">Loading…</p>
        )}
      </main>
    );
  return <SlidePlayer art={art} />;
}
