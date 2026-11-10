"use client";
import Link from "next/link";
import { useState } from "react";
import type { Lang } from "@/lib/data";

const C = {
  id: {
    cta: "Lihat Demo", admin: "Untuk Admin",
    tag: "Karya seni Bali, dalam cerita pengrajinnya",
    hero: "Pindai QR di samping karya, dan dengarkan kisah di baliknya.",
    sub: "Yin Karya adalah website informasi berbasis QR Code. Pengunjung membuka presentasi slide tentang karya, sejarah, filosofi, dan profil pengrajin, dalam bahasa mereka sendiri.",
    pTitle: "Masalah yang kami tangani",
    problems: [
      ["Informasi karya minim", "Wisatawan melihat karya indah, tetapi jarang tahu sejarah, makna, dan proses pembuatannya."],
      ["Kendala bahasa", "Penjelasan umumnya hanya dalam satu bahasa, sehingga wisatawan mancanegara sulit memahami."],
      ["Pengrajin tak terlihat", "Cerita dan suara orang di balik karya jarang sampai ke pengunjung."],
      ["Konten sulit diperbarui", "Papan dan brosur cetak mahal dan cepat usang."],
    ],
    sTitle: "Cara kerjanya",
    steps: [["1", "Pindai", "Scan QR Code di dekat karya, tanpa aplikasi dan tanpa akun."], ["2", "Pilih bahasa", "Indonesia, English, atau 中文."], ["3", "Jelajahi slide", "Karya, sejarah, profil pengrajin, proses, dan filosofi, disajikan seperti presentasi."]],
    fTitle: "Fitur utama",
    feats: ["Presentasi slide interaktif, nyaman di smartphone", "Tiga bahasa dengan satu QR yang sama", "Profil dan suara asli pengrajin", "Suara 30 detik diubah AI menjadi deskripsi tiga bahasa", "QR tetap sama walau konten diperbarui"],
    foot: "Dibuat untuk melestarikan seni dan pengrajin Bali.",
  },
  en: {
    cta: "View Demo", admin: "For Admins",
    tag: "Balinese art, told through its makers",
    hero: "Scan the QR beside an artwork and hear the story behind it.",
    sub: "Yin Karya is a QR-based information website. Visitors open a slide presentation about the artwork, its history, philosophy and the artisan's profile, in their own language.",
    pTitle: "The problem we address",
    problems: [
      ["Little information", "Visitors admire the work but rarely learn its history, meaning or how it is made."],
      ["Language barrier", "Explanations are usually in one language, leaving international visitors behind."],
      ["Invisible artisans", "The stories and voices behind the work rarely reach visitors."],
      ["Hard to update", "Printed signs and brochures are costly and quickly outdated."],
    ],
    sTitle: "How it works",
    steps: [["1", "Scan", "Scan the QR Code near the artwork. No app, no account."], ["2", "Choose language", "Indonesian, English or 中文."], ["3", "Explore slides", "Artwork, history, artisan profile, process and philosophy, presented like a deck."]],
    fTitle: "Key features",
    feats: ["Interactive slide presentation, built for phones", "Three languages from one QR", "Artisan profiles and real voices", "A 30-second voice note becomes a three-language description via AI", "The QR stays the same when content is updated"],
    foot: "Built to preserve Balinese art and its artisans.",
  },
  zh: {
    cta: "查看演示", admin: "管理员入口",
    tag: "通过工匠之口，讲述巴厘艺术",
    hero: "扫描作品旁的二维码，聆听背后的故事。",
    sub: "Yin Karya 是基于二维码的信息网站。游客可用自己的语言浏览幻灯片，了解作品、历史、哲学与工匠简介。",
    pTitle: "我们要解决的问题",
    problems: [
      ["信息匮乏", "游客欣赏作品，却很少了解其历史、寓意与制作过程。"],
      ["语言障碍", "讲解通常只有一种语言，外国游客难以理解。"],
      ["工匠被忽视", "作品背后的故事与声音很少传达给游客。"],
      ["难以更新", "印刷展板和手册成本高且容易过时。"],
    ],
    sTitle: "使用方式",
    steps: [["1", "扫描", "扫描作品旁的二维码，无需下载应用或注册。"], ["2", "选择语言", "印尼语、英语或中文。"], ["3", "浏览幻灯片", "作品、历史、工匠简介、工艺与哲学，以演示文稿形式呈现。"]],
    fTitle: "主要功能",
    feats: ["适合手机的互动幻灯片", "同一个二维码支持三种语言", "工匠简介与真实声音", "30秒语音由AI生成三语描述", "内容更新后二维码不变"],
    foot: "为守护巴厘艺术与工匠而生。",
  },
} as const;

export default function Landing() {
  const [lang, setLang] = useState<Lang>("id");
  const c = C[lang];
  return (
    <main className="min-h-dvh bg-stone-950 text-stone-100">
      <header className="mx-auto flex max-w-5xl items-center justify-between p-5">
        <span className="font-serif text-xl text-amber-400">Yin Karya</span>
        <div className="flex gap-1">
          {(["id", "en", "zh"] as Lang[]).map((l) => (
            <button key={l} onClick={() => setLang(l)} className={`rounded-full px-3 py-1 text-sm ${lang === l ? "bg-amber-500 text-stone-950" : "bg-stone-800"}`}>
              {l === "zh" ? "中文" : l.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 pb-16 pt-8">
        <p className="text-sm uppercase tracking-widest text-amber-500">{c.tag}</p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-amber-100 md:text-6xl">{c.hero}</h1>
        <p className="mt-5 max-w-2xl text-lg text-stone-300">{c.sub}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/a/topeng-barong" className="rounded-full bg-amber-500 px-6 py-3 font-medium text-stone-950">{c.cta}</Link>
          <Link href="/admin" className="rounded-full bg-stone-800 px-6 py-3">{c.admin}</Link>
        </div>
      </section>

      <section className="bg-stone-900/60 py-14">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="font-serif text-3xl text-amber-300">{c.pTitle}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {c.problems.map(([t, d]) => (
              <div key={t} className="rounded-2xl border border-stone-800 p-5">
                <h3 className="font-medium text-amber-200">{t}</h3>
                <p className="mt-1 text-stone-300">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="font-serif text-3xl text-amber-300">{c.sTitle}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {c.steps.map(([n, t, d]) => (
              <div key={n} className="rounded-2xl bg-stone-900 p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 font-serif text-stone-950">{n}</div>
                <h3 className="mt-3 font-medium">{t}</h3>
                <p className="mt-1 text-sm text-stone-300">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-900/60 py-14">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="font-serif text-3xl text-amber-300">{c.fTitle}</h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {c.feats.map((f) => (
              <li key={f} className="flex gap-3 text-stone-200"><span className="text-amber-500">◆</span>{f}</li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="mx-auto max-w-5xl p-8 text-center text-sm text-stone-500">{c.foot}</footer>
    </main>
  );
}
