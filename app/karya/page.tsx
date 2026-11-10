import Link from "next/link";
import { artworks } from "@/lib/data";

export default function Home() {
  return (
    <main className="mx-auto min-h-dvh max-w-md bg-stone-950 p-6 text-stone-100">
      <h1 className="font-serif text-4xl text-amber-400">Yin Karya</h1>
      <p className="mt-2 text-stone-400">Karya seni & pengrajin Bali / Balinese art & artisans / 巴厘艺术与工匠</p>
      <ul className="mt-8 space-y-4">
        {artworks.map((a) => (
          <li key={a.slug}>
            <Link href={`/a/${a.slug}`} className={`block rounded-2xl bg-gradient-to-br ${a.hue} p-5`}>
              <div className="font-serif text-2xl">{a.name.id}</div>
              <div className="text-sm text-stone-200">{a.artisan} · {a.origin}</div>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/" className="mt-10 block text-sm text-stone-500 underline">← Beranda</Link>
    </main>
  );
}
