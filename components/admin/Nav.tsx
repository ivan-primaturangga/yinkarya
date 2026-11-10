"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/qr", label: "QR Codes" },
  { href: "/admin/ai", label: "AI Studio" },
];

export default function Nav() {
  const path = usePathname();
  return (
    <aside className="flex shrink-0 flex-row items-center gap-1 border-b bg-card p-3 md:w-56 md:flex-col md:items-stretch md:border-b-0 md:border-r md:p-4">
      <div className="mr-3 font-serif text-xl text-amber-700 md:mb-6">Yin Karya</div>
      <nav className="flex flex-1 gap-1 md:flex-col">
        {items.map((i) => (
          <Link key={i.href} href={i.href} className={`rounded-md px-3 py-2 text-sm ${path === i.href ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
            {i.label}
          </Link>
        ))}
        <Link href="/karya" className="rounded-md px-3 py-2 text-sm hover:bg-muted">View site ↗</Link>
      </nav>
      <form action={logout}><Button variant="outline" size="sm" type="submit">Log out</Button></form>
    </aside>
  );
}
