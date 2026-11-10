export async function POST(req: Request) {
  const form = await req.formData();
  let transcript = String(form.get("text") || "");
  const audio = form.get("audio");
  const openai = process.env.OPENAI_API_KEY;
  const claude = process.env.ANTHROPIC_API_KEY;

  if (audio instanceof Blob) {
    if (!openai) return Response.json({ transcript: "", id: "", en: "", zh: "", note: "OPENAI_API_KEY belum diisi, transkripsi suara belum aktif. Gunakan ketik manual." });
    const fd = new FormData();
    fd.append("file", audio, "voice.webm");
    fd.append("model", "whisper-1");
    const r = await fetch("https://api.openai.com/v1/audio/transcriptions", { method: "POST", headers: { Authorization: `Bearer ${openai}` }, body: fd });
    if (!r.ok) return Response.json({ transcript: "", id: "", en: "", zh: "", note: "Transkripsi gagal." });
    transcript = (await r.json()).text ?? "";
  }

  if (!transcript) return Response.json({ transcript: "", id: "", en: "", zh: "", note: "Tidak ada teks." });
  if (!claude) return Response.json({ transcript, id: "", en: "", zh: "", note: "ANTHROPIC_API_KEY belum diisi, draf AI nonaktif. Transkrip tetap bisa dipakai manual." });

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": claude, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-5-5",
      max_tokens: 1000,
      messages: [{ role: "user", content: `Dari cerita pengrajin Bali berikut, tulis deskripsi singkat (2-3 kalimat) untuk slide pameran dalam tiga bahasa. Jawab HANYA JSON: {"id":"...","en":"...","zh":"..."}\n\nCerita: ${transcript}` }],
    }),
  });
  if (!r.ok) return Response.json({ transcript, id: "", en: "", zh: "", note: "Draf AI gagal." });
  const text: string = (await r.json()).content?.[0]?.text ?? "{}";
  try {
    const j = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
    return Response.json({ transcript, ...j });
  } catch {
    return Response.json({ transcript, id: "", en: "", zh: "", note: "Format AI tidak terbaca." });
  }
}
