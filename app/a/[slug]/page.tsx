import ArtworkView from "@/components/ArtworkView";
import { artworks } from "@/lib/data";

export function generateStaticParams() {
  return artworks.map((a) => ({ slug: a.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArtworkView slug={slug} />;
}
