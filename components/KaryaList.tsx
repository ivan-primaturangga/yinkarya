"use client";
import Link from "next/link";
import { useArtworks } from "@/lib/store";

export default function KaryaList() {
  const { arts } = useArtworks();
  const list = arts.filter((a) => a.status !== "draft");
  return (
    <ul className="mt-8 space-y-4">
      {list.map((a) => (
        <li key={a.slug}>
          <Link href={`/a/${a.slug}`} className={`block rounded-2xl bg-gradient-to-br ${a.hue || "from-amber-700 via-red-800 to-stone-900"} p-5`}>
            <div className="font-serif text-2xl">{a.name.en || a.name.id}</div>
            <div className="text-sm text-stone-200">{a.artisan} · {a.origin}</div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
