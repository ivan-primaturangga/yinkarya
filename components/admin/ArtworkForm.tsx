"use client";
import { useState } from "react";
import type { Artwork, L10n, Lang, Slide } from "@/lib/data";
import { demoSlidesFromStory, demoTranslate, SAMPLE_VOICE_TEXT } from "@/lib/ai-demo";
import { saveArtwork } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const empty = (): L10n => ({ id: "", en: "", zh: "" });
export const newArtwork = (): Artwork => ({
  slug: "", name: empty(), category: empty(), artisan: "", origin: "", hue: "from-amber-700 via-red-800 to-stone-900", status: "draft",
  profile: { name: "", years: 0, specialty: empty(), bio: empty() },
  slides: [{ kind: "cover", title: empty(), body: empty() }],
});
const KINDS = ["cover", "intro", "artisan", "story", "process", "philosophy", "closing"];
const slugify = (s: string) => s.replace(/\[[^\]]*\]/g, " ").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const LANGS: Lang[] = ["id", "en", "zh"];
const LBL: Record<Lang, string> = { id: "Indonesia", en: "English", zh: "中文" };
const selectCls = "h-9 rounded-md border border-input bg-background px-2 text-sm";

function AiBtn({ children, onClick, busy }: { children: React.ReactNode; onClick: () => void; busy?: boolean }) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick} disabled={busy} className="border-amber-400 text-amber-800">
      ✨ {busy ? "AI working…" : children} <Badge variant="secondary" className="ml-1">Demo</Badge>
    </Button>
  );
}

export default function ArtworkForm({ initial, originalSlug, onDone }: { initial: Artwork; originalSlug?: string; onDone: () => void }) {
  const [a, setA] = useState<Artwork>(structuredClone(initial));
  const [lang, setLang] = useState<Lang>("id");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [story, setStory] = useState("");

  const setL = (k: "name" | "category", v: string) => setA((x) => ({ ...x, [k]: { ...x[k], [lang]: v } }));
  const setP = (k: "specialty" | "bio", v: string) => setA((x) => ({ ...x, profile: { ...x.profile, [k]: { ...x.profile[k], [lang]: v } } }));
  const setSlide = (i: number, f: (s: Slide) => Slide) => setA((x) => ({ ...x, slides: x.slides.map((s, j) => (j === i ? f(s) : s)) }));
  const move = (i: number, d: number) => setA((x) => {
    const s = [...x.slides], j = i + d;
    if (j < 0 || j >= s.length) return x;
    [s[i], s[j]] = [s[j], s[i]];
    return { ...x, slides: s };
  });

  // --- AI concept actions (simulated) ---
  async function fill(v: L10n): Promise<L10n> {
    if (!v[lang]) return v;
    const t = await demoTranslate(v[lang], lang);
    return { id: v.id || t.id, en: v.en || t.en, zh: v.zh || t.zh };
  }
  async function translateAll() {
    setBusy("translate");
    const name = await fill(a.name), category = await fill(a.category);
    const specialty = await fill(a.profile.specialty), bio = await fill(a.profile.bio);
    const slides = await Promise.all(a.slides.map(async (s) => ({ ...s, title: await fill(s.title), body: await fill(s.body) })));
    setA((x) => ({ ...x, name, category, profile: { ...x.profile, specialty, bio }, slides }));
    setBusy(null);
  }
  async function genSlides() {
    if (!story.trim()) return;
    setBusy("slides");
    const slides = await demoSlidesFromStory(story, a.name);
    setA((x) => ({ ...x, slides }));
    setBusy(null);
  }
  async function slideTranslate(i: number) {
    setBusy(`s${i}`);
    const s = a.slides[i];
    const title = await demoTranslate(s.title[lang], lang), body = await demoTranslate(s.body[lang], lang);
    setSlide(i, (x) => ({ ...x, title: { id: x.title.id || title.id, en: x.title.en || title.en, zh: x.title.zh || title.zh }, body: { id: x.body.id || body.id, en: x.body.en || body.en, zh: x.body.zh || body.zh } }));
    setBusy(null);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const slug = a.slug || slugify(a.name.en || a.name.id);
    if (!slug) return setErr("Please enter an artwork name or slug.");
    if (!a.name.id && !a.name.en) return setErr("Artwork name is required.");
    if (!a.artisan.trim()) return setErr("Artisan name is required.");
    const out: Artwork = { ...a, slug, profile: { ...a.profile, name: a.profile.name || a.artisan } };
    const e2 = saveArtwork(out, originalSlug);
    if (e2) return setErr(e2);
    onDone();
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-2xl">{originalSlug ? "Edit artwork" : "New artwork"}</h2>
        <div className="flex gap-1">
          {LANGS.map((l) => (
            <Button key={l} type="button" size="sm" variant={lang === l ? "default" : "outline"} onClick={() => setLang(l)}>{LBL[l]}</Button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Details</CardTitle><CardDescription>Text fields follow the language selected above.</CardDescription></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label>Name ({LBL[lang]})</Label><Input value={a.name[lang]} onChange={(e) => setL("name", e.target.value)} /></div>
          <div className="space-y-2"><Label>Category ({LBL[lang]})</Label><Input value={a.category[lang]} onChange={(e) => setL("category", e.target.value)} /></div>
          <div className="space-y-2"><Label>Slug (QR link)</Label><Input value={a.slug} placeholder={slugify(a.name.en || a.name.id) || "auto"} onChange={(e) => setA({ ...a, slug: slugify(e.target.value) })} disabled={!!originalSlug} /></div>
          <div className="space-y-2"><Label>Origin</Label><Input value={a.origin} onChange={(e) => setA({ ...a, origin: e.target.value })} placeholder="Mas, Ubud, Bali" /></div>
          <div className="space-y-2"><Label>Artisan name</Label><Input value={a.artisan} onChange={(e) => setA({ ...a, artisan: e.target.value, profile: { ...a.profile, name: e.target.value } })} /></div>
          <div className="space-y-2"><Label>Years of craft</Label><Input type="number" min={0} value={a.profile.years} onChange={(e) => setA({ ...a, profile: { ...a.profile, years: Number(e.target.value) } })} /></div>
          <div className="space-y-2"><Label>Specialty ({LBL[lang]})</Label><Input value={a.profile.specialty[lang]} onChange={(e) => setP("specialty", e.target.value)} /></div>
          <div className="space-y-2"><Label>Status</Label>
            <select className={selectCls + " w-full"} value={a.status ?? "draft"} onChange={(e) => setA({ ...a, status: e.target.value as "draft" | "published" })}>
              <option value="draft">Draft</option><option value="published">Published</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-2"><Label>Artisan bio ({LBL[lang]})</Label><Textarea value={a.profile.bio[lang]} onChange={(e) => setP("bio", e.target.value)} /></div>
        </CardContent>
      </Card>

      <Card className="border-amber-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">AI assistant <Badge variant="secondary">Concept demo</Badge></CardTitle>
          <CardDescription>Simulated AI that works without an API key. In production these call Whisper and Claude.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label>Artisan story (typed, or from a 30-second voice note)</Label>
          <Textarea value={story} onChange={(e) => setStory(e.target.value)} placeholder="Paste or type the artisan's story…" />
          <div className="flex flex-wrap gap-2">
            <AiBtn busy={busy === "voice"} onClick={async () => { setBusy("voice"); await new Promise((r) => setTimeout(r, 1200)); setStory(SAMPLE_VOICE_TEXT); setBusy(null); }}>Use sample voice note</AiBtn>
            <AiBtn busy={busy === "slides"} onClick={genSlides}>Generate slides from story</AiBtn>
            <AiBtn busy={busy === "translate"} onClick={translateAll}>Fill missing translations</AiBtn>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Slides ({a.slides.length})</CardTitle><CardDescription>Order matters. Editing {LBL[lang]}.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          {a.slides.map((s, i) => (
            <div key={i} className="space-y-2 rounded-lg border p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">#{i + 1}</span>
                <select className={selectCls} value={s.kind} onChange={(e) => setSlide(i, (x) => ({ ...x, kind: e.target.value }))}>{KINDS.map((k) => <option key={k}>{k}</option>)}</select>
                <div className="ml-auto flex gap-1">
                  <Button type="button" size="sm" variant="outline" onClick={() => move(i, -1)} disabled={i === 0}>↑</Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => move(i, 1)} disabled={i === a.slides.length - 1}>↓</Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => setA((x) => ({ ...x, slides: x.slides.filter((_, j) => j !== i) }))}>Remove</Button>
                </div>
              </div>
              <Input placeholder="Slide title" value={s.title[lang]} onChange={(e) => setSlide(i, (x) => ({ ...x, title: { ...x.title, [lang]: e.target.value } }))} />
              <Textarea placeholder="Slide text" value={s.body[lang]} onChange={(e) => setSlide(i, (x) => ({ ...x, body: { ...x.body, [lang]: e.target.value } }))} />
              <AiBtn busy={busy === `s${i}`} onClick={() => slideTranslate(i)}>Translate this slide</AiBtn>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => setA((x) => ({ ...x, slides: [...x.slides, { kind: "story", title: empty(), body: empty() }] }))}>+ Add slide</Button>
        </CardContent>
      </Card>

      {err && <p className="text-sm text-destructive">{err}</p>}
      <div className="flex gap-2">
        <Button type="submit">Save artwork</Button>
        <Button type="button" variant="outline" onClick={onDone}>Cancel</Button>
      </div>
    </form>
  );
}
