"use client";
import { useRef, useState } from "react";
import QRCode from "qrcode";
import type { Artwork } from "@/lib/data";

type Draft = { transcript: string; id: string; en: string; zh: string; note?: string };

export default function AdminPanel({ arts }: { arts: Artwork[] }) {
  const [qrs, setQrs] = useState<Record<string, string>>({});
  const [rec, setRec] = useState(false);
  const [secs, setSecs] = useState(0);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [typed, setTyped] = useState("");
  const mr = useRef<MediaRecorder | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  async function makeQr(slug: string) {
    const url = `${location.origin}/a/${slug}`;
    setQrs((q) => ({ ...q, [slug]: "" }));
    const data = await QRCode.toDataURL(url, { width: 400, margin: 2 });
    setQrs((q) => ({ ...q, [slug]: data }));
  }

  async function send(body: FormData) {
    setBusy(true);
    try {
      const r = await fetch("/api/voice", { method: "POST", body });
      setDraft(await r.json());
    } catch {
      setDraft({ transcript: "", id: "", en: "", zh: "", note: "Gagal menghubungi server." });
    }
    setBusy(false);
  }

  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const chunks: Blob[] = [];
    const m = new MediaRecorder(stream);
    mr.current = m;
    m.ondataavailable = (e) => chunks.push(e.data);
    m.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      const fd = new FormData();
      fd.append("audio", new Blob(chunks, { type: m.mimeType }), "voice.webm");
      send(fd);
    };
    m.start();
    setRec(true);
    setSecs(0);
    timer.current = setInterval(() => {
      setSecs((s) => {
        if (s >= 29) stop();
        return s + 1;
      });
    }, 1000);
  }
  function stop() {
    if (timer.current) clearInterval(timer.current);
    if (mr.current?.state === "recording") mr.current.stop();
    setRec(false);
  }
  function sendText() {
    const fd = new FormData();
    fd.append("text", typed);
    send(fd);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-10 p-6">
      <section>
        <h2 className="font-serif text-2xl text-amber-400">QR Code</h2>
        <ul className="mt-4 space-y-4">
          {arts.map((a) => (
            <li key={a.slug} className="rounded-xl bg-stone-900 p-4">
              <div className="flex items-center justify-between">
                <span>{a.name.id} <code className="text-stone-500">/a/{a.slug}</code></span>
                <button onClick={() => makeQr(a.slug)} className="rounded-full bg-amber-500 px-4 py-2 text-sm text-stone-950">Buat QR</button>
              </div>
              {qrs[a.slug] && (
                <div className="mt-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrs[a.slug]} alt={`QR ${a.slug}`} className="h-40 w-40 rounded bg-white" />
                  <a href={qrs[a.slug]} download={`qr-${a.slug}.png`} className="mt-2 inline-block text-sm text-amber-400 underline">Unduh PNG</a>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-serif text-2xl text-amber-400">Suara pengrajin → deskripsi</h2>
        <p className="mt-1 text-sm text-stone-400">Rekam maksimal 30 detik, atau ketik manual.</p>
        <div className="mt-4 flex items-center gap-3">
          {!rec ? (
            <button onClick={start} disabled={busy} className="rounded-full bg-red-600 px-5 py-3">● Rekam</button>
          ) : (
            <button onClick={stop} className="rounded-full bg-stone-700 px-5 py-3">■ Stop ({secs}/30s)</button>
          )}
          {busy && <span className="text-stone-400">Memproses…</span>}
        </div>
        <textarea value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Atau ketik cerita karya di sini…" className="mt-4 h-24 w-full rounded-xl bg-stone-900 p-3" />
        <button onClick={sendText} disabled={!typed || busy} className="mt-2 rounded-full bg-amber-500 px-4 py-2 text-sm text-stone-950 disabled:opacity-40">Buat draf</button>

        {draft && (
          <div className="mt-6 space-y-3 rounded-xl bg-stone-900 p-4 text-sm">
            {draft.note && <p className="text-amber-300">{draft.note}</p>}
            {draft.transcript && <p><b>Transkrip:</b> {draft.transcript}</p>}
            {draft.id && <p><b>ID:</b> {draft.id}</p>}
            {draft.en && <p><b>EN:</b> {draft.en}</p>}
            {draft.zh && <p><b>中文:</b> {draft.zh}</p>}
          </div>
        )}
      </section>
    </div>
  );
}
