import Link from "next/link";
import KaryaList from "@/components/KaryaList";

export default function Home() {
  return (
    <main className="mx-auto min-h-dvh max-w-md bg-stone-950 p-6 text-stone-100">
      <h1 className="font-serif text-4xl text-amber-400">Yin Karya</h1>
      <p className="mt-2 text-stone-400">Balinese art & artisans</p>
      <KaryaList />
      <Link href="/" className="mt-10 block text-sm text-stone-500 underline">← Home</Link>
    </main>
  );
}
