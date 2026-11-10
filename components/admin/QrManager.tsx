"use client";
import { useState } from "react";
import QRCode from "qrcode";
import type { Artwork } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function QrManager({ arts }: { arts: Artwork[] }) {
  const [qrs, setQrs] = useState<Record<string, string>>({});
  async function make(slug: string) {
    setQrs((q) => ({ ...q, [slug]: "" }));
    const data = await QRCode.toDataURL(`${location.origin}/a/${slug}`, { width: 480, margin: 2 });
    setQrs((q) => ({ ...q, [slug]: data }));
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {arts.map((a) => (
        <Card key={a.slug}>
          <CardHeader>
            <CardTitle>{a.name.en}</CardTitle>
            <CardDescription><code>/a/{a.slug}</code> · stays the same when content is edited</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {qrs[a.slug] ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrs[a.slug]} alt={`QR ${a.slug}`} className="h-44 w-44 rounded border bg-white" />
                <a href={qrs[a.slug]} download={`qr-${a.slug}.png`} className="text-sm underline">Download PNG</a>
              </>
            ) : null}
            <div><Button onClick={() => make(a.slug)}>{qrs[a.slug] ? "Regenerate" : "Generate QR"}</Button></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
