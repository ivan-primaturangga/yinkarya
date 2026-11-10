"use client";
import { useEffect, useState } from "react";
import type { Artwork, Lang } from "@/lib/data";

const LABELS: Record<Lang, string> = { id: "ID", en: "EN", zh: "中文" };
const UI: Record<Lang, { next: string; prev: string; by: string; years: string }> = {
  id: { next: "Lanjut", prev: "Kembali", by: "Oleh", years: "tahun berkarya" },
  en: { next: "Next", prev: "Previous", by: "By", years: "years of craft" },
  zh: { next: "下一页", prev: "上一页", by: "作者", years: "年创作经验" },
};

function Typed({ text }: { text: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const id = setInterval(() => setN((v) => (v >= text.length ? (clearInterval(id), v) : v + 1)), 22);
    return () => clearInterval(id);
  }, [text]);
  return (
    <>
      {text.slice(0, n)}
      <span className="opacity-0">{text.slice(n)}</span>
    </>
  );
}

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
      className="relative flex h-dvh w-full flex-col overflow-hidden bg-stone-950 text-stone-100"
      onTouchStart={(e) => setStartX(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (startX === null) return;
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        setStartX(null);
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-[position:22%_center] md:bg-center"
        style={{ backgroundImage: "url(/slide-bg.jpg)" }}
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />

      <header className="relative z-10 flex items-center justify-between p-4">
        <span className="font-serif text-lg text-amber-400 drop-shadow">Yin Karya</span>
        <div className="flex gap-1">
          {(Object.keys(LABELS) as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`rounded-full px-3 py-1 text-sm backdrop-blur ${lang === l ? "bg-amber-500 text-stone-950" : "bg-black/50"}`}
            >
              {LABELS[l]}
            </button>
          ))}
        </div>
      </header>

      <div className="relative z-10 flex flex-1 items-end px-4 pb-2 md:items-start md:pl-[40%] md:pr-[5%] md:pt-[8dvh]">
        <div
          key={`${i}-${lang}`}
          className="relative w-full rounded-[2rem] border-2 border-black bg-white text-stone-900 shadow-2xl animate-[slide_.35s_ease] md:rounded-[3rem]"
          style={{ ["--d" as string]: `${dir * 30}px` }}
        >
          {/* speech-bubble tail */}
          <span aria-hidden className="absolute -top-[13px] left-16 h-6 w-6 rotate-45 border-l-2 border-t-2 border-black bg-white md:hidden" />
          <span aria-hidden className="absolute -left-[13px] top-20 hidden h-6 w-6 rotate-45 border-b-2 border-l-2 border-black bg-white md:block" />

          <div className="max-h-[52dvh] overflow-y-auto p-6 md:max-h-[60dvh] md:p-10">
          <span className="rounded bg-stone-100 px-2 py-1 text-xs text-stone-600">
            {pick(art.category)} · {art.origin}
          </span>
          <h1 className="mt-3 font-serif text-2xl text-amber-800 md:text-4xl">{pick(s.title)}</h1>
          <p className="mt-2 text-base leading-relaxed md:text-xl">
            <Typed text={pick(s.body)} />
          </p>
          {s.kind === "artisan" && (
            <div className="mt-4 rounded-xl bg-amber-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 font-serif text-xl text-stone-950">
                  {art.profile.name.split(" ").slice(-1)[0][0]}
                </div>
                <div>
                  <div className="font-medium">{art.profile.name}</div>
                  <div className="text-sm text-amber-800">{pick(art.profile.specialty)}</div>
                </div>
              </div>
              <p className="mt-3 text-sm text-stone-700">{pick(art.profile.bio)}</p>
              <p className="mt-2 text-xs text-stone-500">
                {art.profile.years} {UI[lang].years}
              </p>
            </div>
          )}
          {s.kind === "cover" && (
            <p className="mt-3 text-sm text-stone-500">
              {UI[lang].by} {art.artisan}
            </p>
          )}
          </div>
        </div>
      </div>

      <footer className="relative z-10 flex items-center justify-between p-4">
        <button onClick={() => go(-1)} disabled={i === 0} className="rounded-full bg-black/60 px-5 py-3 backdrop-blur disabled:opacity-30">
          {UI[lang].prev}
        </button>
        <span className="rounded-full bg-black/60 px-3 py-1 text-sm backdrop-blur">
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
