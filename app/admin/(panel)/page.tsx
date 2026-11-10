import Link from "next/link";
import { artworks } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Dashboard() {
  const artisans = new Set(artworks.map((a) => a.artisan)).size;
  const slides = artworks.reduce((n, a) => n + a.slides.length, 0);
  const stats = [
    ["Artworks", artworks.length], ["Artisans", artisans], ["Slides", slides], ["QR codes", artworks.length], ["Languages", 3],
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your content.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map(([k, v]) => (
          <Card key={k}>
            <CardHeader className="pb-2"><CardDescription>{k}</CardDescription><CardTitle className="text-3xl">{v}</CardTitle></CardHeader>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Artworks</CardTitle><CardDescription>Each artwork has one presentation and one permanent QR link.</CardDescription></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Artwork</TableHead><TableHead>Artisan</TableHead><TableHead>Category</TableHead><TableHead>Slides</TableHead><TableHead>Status</TableHead><TableHead /></TableRow>
            </TableHeader>
            <TableBody>
              {artworks.map((a) => (
                <TableRow key={a.slug}>
                  <TableCell className="font-medium">{a.name.en}</TableCell>
                  <TableCell>{a.artisan}</TableCell>
                  <TableCell>{a.category.en}</TableCell>
                  <TableCell>{a.slides.length}</TableCell>
                  <TableCell><Badge>Published</Badge></TableCell>
                  <TableCell className="text-right">
                    <Link href={`/a/${a.slug}`} target="_blank" className={buttonVariants({ variant: "outline", size: "sm" })}>Preview</Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
