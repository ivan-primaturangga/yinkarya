"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VoiceRecorder from "@/components/admin/VoiceRecorder";

const SAMPLE = "Topeng ini saya buat dari kayu pule. Ayah saya mengajari saya mengukir sejak umur dua belas. Barong melindungi desa kami, jadi setiap goresan harus dikerjakan dengan hati yang tenang.";
const STEPS = [
  ["Voice note", "Artisan records 30 seconds on a phone, or admin uploads it."],
  ["Speech-to-text", "Whisper transcribes the Indonesian audio."],
  ["AI drafting", "Claude writes a slide-ready story and adapts it to 3 languages."],
  ["Human review", "Admin checks and edits the draft, then publishes."],
];
const RESULT = {
  id: "Topeng ini dibuat dari kayu pule oleh I Wayan Sudarta, yang belajar mengukir dari ayahnya sejak usia dua belas. Barong dipercaya melindungi desa, sehingga setiap goresan dikerjakan dengan ketenangan.",
  en: "This mask is carved from pule wood by I Wayan Sudarta, who learned carving from his father at age twelve. The Barong is believed to protect the village, so every stroke is made with a calm mind.",
  zh: "这件面具由 I Wayan Sudarta 以普勒木雕刻而成，他十二岁起跟随父亲学艺。巴龙被认为守护村庄，因此每一刀都需心怀平静。",
};

function VoiceDemo() {
  const [step, setStep] = useState(-1);
  const run = () => {
    setStep(0);
    [1, 2, 3, 4].forEach((n, i) => setTimeout(() => setStep(n), (i + 1) * 1100));
  };
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        {STEPS.map(([t, d], i) => (
          <div key={t} className={`rounded-lg border p-3 text-sm transition ${step >= i ? "border-amber-500 bg-amber-50" : "opacity-60"}`}>
            <div className="font-medium">{i + 1}. {t}</div>
            <div className="mt-1 text-xs text-muted-foreground">{d}</div>
          </div>
        ))}
      </div>
      <Button onClick={run} disabled={step >= 0 && step < 4}>{step < 0 ? "▶ Run sample voice note" : step < 4 ? "Processing…" : "Run again"}</Button>
      {step >= 1 && <p className="rounded-lg bg-muted p-3 text-sm"><b>Transcript:</b> {SAMPLE}</p>}
      {step >= 3 && (
        <div className="grid gap-3 md:grid-cols-3">
          {(["id", "en", "zh"] as const).map((l) => (
            <Card key={l}><CardHeader className="pb-2"><CardTitle className="text-sm uppercase">{l === "zh" ? "中文" : l}</CardTitle></CardHeader><CardContent className="text-sm">{RESULT[l]}</CardContent></Card>
          ))}
        </div>
      )}
      {step >= 4 && <p className="text-sm text-green-700">✔ Draft ready for admin review before publishing.</p>}
    </div>
  );
}

const QA: Record<string, string> = {
  "Who made this mask?": "I Wayan Sudarta, a carver from Mas, Ubud, with 28 years of experience. He learned the craft from his father.",
  "What wood is used?": "Pule wood, chosen for its fine grain. It is carved, smoothed, painted with natural pigments and gilded.",
  "What does the Barong mean?": "The Barong is a guardian spirit that represents good. Together with its opposite it expresses rwa bhineda, the balance that keeps the world in harmony.",
};
function AskDemo() {
  const [q, setQ] = useState<string | null>(null);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {Object.keys(QA).map((k) => <Button key={k} variant={q === k ? "default" : "outline"} size="sm" onClick={() => setQ(k)}>{k}</Button>)}
      </div>
      {q && (
        <div className="space-y-2 rounded-lg bg-muted p-4 text-sm">
          <p className="font-medium">Visitor: {q}</p>
          <p>Yin Karya AI: {QA[q]}</p>
          <p className="text-xs text-muted-foreground">Answers come only from the verified artwork content, so the AI cannot invent facts.</p>
        </div>
      )}
    </div>
  );
}

const IDEAS = [
  { title: "Smart translation with glossary", problem: "Direct translation loses Balinese terms like rwa bhineda or pule.", how: "AI translates into EN/ZH, keeps sacred terms with a short explanation, and flags low-confidence lines for review.", pitch: "Culture stays accurate, and admins stop translating by hand." },
  { title: "Artisan-voice narration (TTS)", problem: "Not every artisan can record every language.", how: "Approved text becomes natural narration in English and Mandarin. The original artisan voice stays on the Indonesian slide.", pitch: "Visitors hear the story in their language, and the artisan's real voice is kept." },
  { title: "Cultural accuracy check", problem: "Historical and philosophical claims need verification.", how: "AI highlights claims that need a cultural expert's confirmation before publishing.", pitch: "We scale content without sacrificing trust." },
];

export default function AiStudio() {
  return (
    <Tabs defaultValue="voice">
      <TabsList className="flex-wrap">
        <TabsTrigger value="voice">Voice → Story</TabsTrigger>
        <TabsTrigger value="ask">Ask the artwork</TabsTrigger>
        <TabsTrigger value="more">More ideas</TabsTrigger>
        <TabsTrigger value="live">Live recorder</TabsTrigger>
      </TabsList>

      <TabsContent value="voice" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Voice to Story <Badge variant="secondary">Concept demo</Badge></CardTitle>
            <CardDescription>A 30-second voice note becomes a slide-ready description in three languages.</CardDescription>
          </CardHeader>
          <CardContent><VoiceDemo /></CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="ask" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Ask the artwork <Badge variant="secondary">Concept demo</Badge></CardTitle>
            <CardDescription>Visitors ask questions in their own language, and the AI answers from verified content only.</CardDescription>
          </CardHeader>
          <CardContent><AskDemo /></CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="more" className="mt-4 grid gap-4 md:grid-cols-3">
        {IDEAS.map((i) => (
          <Card key={i.title}>
            <CardHeader><CardTitle className="text-base">{i.title}</CardTitle><Badge variant="secondary" className="w-fit">Concept</Badge></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><b>Problem:</b> {i.problem}</p>
              <p><b>How:</b> {i.how}</p>
              <p className="text-amber-800"><b>Pitch line:</b> {i.pitch}</p>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="live" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Live recorder</CardTitle>
            <CardDescription>Works when OPENAI_API_KEY and ANTHROPIC_API_KEY are set. Without keys it shows a notice.</CardDescription>
          </CardHeader>
          <CardContent><VoiceRecorder /></CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
