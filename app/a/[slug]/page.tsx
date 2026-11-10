import { notFound } from "next/navigation";
import SlidePlayer from "@/components/SlidePlayer";
import { artworks, getArtwork } from "@/lib/data";

export function generateStaticParams() {
  return artworks.map((a) => ({ slug: a.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const art = getArtwork(slug);
  if (!art) notFound();
  return <SlidePlayer art={art} />;
}
