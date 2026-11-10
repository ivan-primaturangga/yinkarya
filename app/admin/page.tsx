import AdminPanel from "@/components/AdminPanel";
import { artworks } from "@/lib/data";

export default function Admin() {
  return (
    <main className="min-h-dvh bg-stone-950 text-stone-100">
      <AdminPanel arts={artworks} />
    </main>
  );
}
