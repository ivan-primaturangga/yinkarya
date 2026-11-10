"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Draft = { transcript: string; id: string; en: string; zh: string; note?: string };

export default function VoiceRecorder() {
  const [rec, setRec] = useState(false);
  const [secs, setSecs] = useState(0);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [typed, setTyped] = useState("");
  const mr = useRef<MediaRecorder | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  async function send(body: FormData) {
    setBusy(true);
    try {
      setDraft(await (await fetch("/api/voice", { method: "POST", body })).json());
    } catch {
      setDraft({ transcript: "", id: "", en: "", zh: "", note: "Could not reach the server." });
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
    timer.current = setInterval(() => setSecs((s) => { if (s >= 29) stop(); return s + 1; }), 1000);
  }
  function stop() {
    if (timer.current) clearInterval(timer.current);
    if (mr.current?.state === "recording") mr.current.stop();
    setRec(false);
  }
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {!rec ? <Button variant="destructive" onClick={start} disabled={busy}>● Record (max 30s)</Button> : <Button variant="secondary" onClick={stop}>■ Stop ({secs}/30s)</Button>}
        {busy && <span className="text-sm text-muted-foreground">Processing…</span>}
      </div>
      <Textarea value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Or type the artwork story here…" />
      <Button variant="outline" disabled={!typed || busy} onClick={() => { const fd = new FormData(); fd.append("text", typed); send(fd); }}>Generate draft</Button>
      {draft && (
        <div className="space-y-2 rounded-lg border bg-muted/50 p-4 text-sm">
          {draft.note && <p className="text-amber-700">{draft.note}</p>}
          {draft.transcript && <p><b>Transcript:</b> {draft.transcript}</p>}
          {draft.id && <p><b>ID:</b> {draft.id}</p>}
          {draft.en && <p><b>EN:</b> {draft.en}</p>}
          {draft.zh && <p><b>中文:</b> {draft.zh}</p>}
        </div>
      )}
    </div>
  );
}
