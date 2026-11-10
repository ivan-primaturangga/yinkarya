"use client";
import Link from "next/link";
import { useState } from "react";
import type { Artwork } from "@/lib/data";
import { deleteArtwork, resetArtworks, useArtworks } from "@/lib/store";
import ArtworkForm, { newArtwork } from "@/components/admin/ArtworkForm";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ArtworksManager() {
  const { arts } = useArtworks();
  const [editing, setEditing] = useState<{ art: Artwork; orig?: string } | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);

  if (editing) return <ArtworkForm initial={editing.art} originalSlug={editing.orig} onDone={() => setEditing(null)} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl">Artworks</h1>
          <p className="text-muted-foreground">Create, edit and delete artworks and their slides.</p>
        </div>
        <Button onClick={() => setEditing({ art: newArtwork() })}>+ New artwork</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{arts.length} artworks</CardTitle>
          <CardDescription>Demo data is stored in this browser. A database (Supabase) replaces this in production.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>Artwork</TableHead><TableHead>Artisan</TableHead><TableHead>Slides</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {arts.map((a) => (
                <TableRow key={a.slug}>
                  <TableCell className="font-medium">{a.name.en || a.name.id}<div className="text-xs text-muted-foreground">/a/{a.slug}</div></TableCell>
                  <TableCell>{a.artisan}</TableCell>
                  <TableCell>{a.slides.length}</TableCell>
                  <TableCell><Badge variant={a.status === "draft" ? "secondary" : "default"}>{a.status === "draft" ? "Draft" : "Published"}</Badge></TableCell>
                  <TableCell className="space-x-1 whitespace-nowrap text-right">
                    <Link href={`/a/${a.slug}`} target="_blank" className={buttonVariants({ variant: "outline", size: "sm" })}>Preview</Link>
                    <Button size="sm" variant="outline" onClick={() => setEditing({ art: a, orig: a.slug })}>Edit</Button>
                    {confirm === a.slug ? (
                      <>
                        <Button size="sm" variant="destructive" onClick={() => { deleteArtwork(a.slug); setConfirm(null); }}>Confirm delete</Button>
                        <Button size="sm" variant="ghost" onClick={() => setConfirm(null)}>Cancel</Button>
                      </>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => setConfirm(a.slug)}>Delete</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {arts.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No artworks yet.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Button variant="ghost" size="sm" onClick={() => { if (confirm !== "__reset") setConfirm("__reset"); else { resetArtworks(); setConfirm(null); } }}>
        {confirm === "__reset" ? "Click again to reset demo data" : "Reset demo data"}
      </Button>
    </div>
  );
}
