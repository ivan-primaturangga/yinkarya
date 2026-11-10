"use client";
import { useState } from "react";
import type { Artwork, Lang } from "@/lib/data";

const LABELS: Record<Lang, string> = { id: "ID", en: "EN", zh: "中文" };
const UI: Record<Lang, { next: string; prev: string; by: string; years: string }> = {
  id: { next: "Lanjut", prev: "Kembali", by: "Oleh", years: "tahun berkarya" },
  en: { next: "Next", prev: "Previous", by: "By", years: "years of craft" },
  zh: { next: "下一页", prev: "上一页", by: "作者", years: "年创作经验" },
};

export default function SlidePlayer({ art }: { art: Artwork }) {
  const [lang, setLang] = useState<Lang>("en");
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [startX, setStartX] = useState<number | null>(null);
  const n = art.slides.length;
  const s = art.slides[i];
  const go = (d: number) => {
    const next = Math.min(n - 1, Math.max(0, i + d));
    if (next !== i) {
      setDir(d);
      setI(next);
    }
  };
  const pick = (l: L10nLike) => l[lang] || l.id;

  return (
    <main
      className="mx-auto flex min-h-dvh max-w-md flex-col bg-stone-950 text-stone-100"
      onTouchStart={(e) => setStartX(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (startX === null) return;
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        setStartX(null);
      }}
    >
      <header className="flex items-center justify-between p-4">
        <span className="font-serif text-lg text-amber-400">Yin Karya</span>
        <div className="flex gap-1">
          {(Object.keys(LABELS) as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`rounded-full px-3 py-1 text-sm ${lang === l ? "bg-amber-500 text-stone-950" : "bg-stone-800"}`}
            >
              {LABELS[l]}
            </button>
          ))}
        </div>
      </header>

      <div key={i} className="flex flex-1 flex-col px-4 animate-[slide_.35s_ease]" style={{ ["--d" as string]: `${dir * 30}px` }}>
        <div className={`h-64 rounded-2xl bg-gradient-to-br ${art.hue} flex items-end p-4 shadow-lg`}>
          <span className="rounded bg-black/40 px-2 py-1 text-xs">
            {pick(art.category)} · {art.origin}
          </span>
        </div>
        <h1 className="mt-6 font-serif text-3xl text-amber-300">{pick(s.title)}</h1>
        <p className="mt-3 text-lg leading-relaxed text-stone-200">{pick(s.body)}</p>
        {s.kind === "artisan" && (
          <div className="mt-5 rounded-2xl bg-stone-900 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 font-serif text-xl text-stone-950">
                {art.profile.name.split(" ").slice(-1)[0][0]}
              </div>
              <div>
                <div className="font-medium">{art.profile.name}</div>
                <div className="text-sm text-amber-300">{pick(art.profile.specialty)}</div>
              </div>
            </div>
            <p className="mt-3 text-sm text-stone-300">{pick(art.profile.bio)}</p>
            <p className="mt-2 text-xs text-stone-400">
              {art.profile.years} {UI[lang].years}
            </p>
          </div>
        )}
        {s.kind === "cover" && (
          <p className="mt-4 text-sm text-stone-400">
            {UI[lang].by} {art.artisan}
          </p>
        )}
      </div>

      <footer className="flex items-center justify-between p-4">
        <button onClick={() => go(-1)} disabled={i === 0} className="rounded-full bg-stone-800 px-5 py-3 disabled:opacity-30">
          {UI[lang].prev}
        </button>
        <span className="text-sm text-stone-400">
          {i + 1}/{n}
        </span>
        <button onClick={() => go(1)} disabled={i === n - 1} className="rounded-full bg-amber-500 px-5 py-3 font-medium text-stone-950 disabled:opacity-30">
          {UI[lang].next}
        </button>
      </footer>
    </main>
  );
}

type L10nLike = Record<Lang, string>;
