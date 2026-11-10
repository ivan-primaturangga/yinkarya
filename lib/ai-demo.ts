// Concept-only "AI" helpers. They simulate latency and return canned/derived output,
// so the demo works with no API keys. Replace the bodies with real API calls later.
import type { L10n, Lang, Slide } from "@/lib/data";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const SAMPLE_STORY: L10n[] = [
  { id: "Topeng ini saya buat dari kayu pule.", en: "I carved this mask from pule wood.", zh: "这件面具是我用普勒木雕刻的。" },
  { id: "Ayah saya mengajari saya mengukir sejak umur dua belas.", en: "My father taught me to carve when I was twelve.", zh: "十二岁起，父亲就教我雕刻。" },
  { id: "Barong melindungi desa kami, jadi setiap goresan dikerjakan dengan hati yang tenang.", en: "The Barong protects our village, so every stroke is made with a calm heart.", zh: "巴龙守护我们的村庄，所以每一刀都要心怀平静。" },
  { id: "Terima kasih telah menghargai karya kami.", en: "Thank you for appreciating our work.", zh: "感谢您欣赏我们的作品。" },
];
export const SAMPLE_VOICE_TEXT = SAMPLE_STORY.map((s) => s.id).join(" ");

/** Pretend to translate `text` written in `from` into all three languages. */
export async function demoTranslate(text: string, from: Lang): Promise<L10n> {
  await wait(700);
  const hit = SAMPLE_STORY.find((s) => s[from] === text.trim());
  if (hit) return hit;
  const tag = (l: Lang) => (l === from ? text : `[AI draft ${l.toUpperCase()}] ${text}`);
  return { id: tag("id"), en: tag("en"), zh: tag("zh") };
}

/** Pretend to turn a story into a slide deck. */
export async function demoSlidesFromStory(story: string, name: L10n): Promise<Slide[]> {
  await wait(1400);
  const sentences = story.split(/(?<=[.!?。])\s+/).filter(Boolean);
  const isSample = story.trim() === SAMPLE_VOICE_TEXT;
  const part = (i: number): L10n => {
    if (isSample && SAMPLE_STORY[i]) return SAMPLE_STORY[i];
    const t = sentences[i] ?? sentences[sentences.length - 1] ?? "";
    return { id: t, en: `[AI draft EN] ${t}`, zh: `[AI draft 中文] ${t}` };
  };
  const t = (id: string, en: string, zh: string): L10n => ({ id, en, zh });
  return [
    { kind: "cover", title: name, body: t("Sebuah karya dari tangan pengrajin Bali.", "A work from the hands of a Balinese artisan.", "出自巴厘工匠之手的作品。") },
    { kind: "artisan", title: t("Sang Pengrajin", "The Artisan", "工匠"), body: part(1) },
    { kind: "process", title: t("Proses", "The Process", "工艺"), body: part(0) },
    { kind: "philosophy", title: t("Filosofi", "Philosophy", "哲学"), body: part(2) },
    { kind: "closing", title: t("Terima Kasih", "Thank You", "谢谢"), body: part(3) },
  ];
}
