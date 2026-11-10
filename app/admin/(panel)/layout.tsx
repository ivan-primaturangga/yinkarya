import { Suspense } from "react";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import Nav from "@/components/admin/Nav";

async function Guard({ children }: { children: React.ReactNode }) {
  if (!(await isAuthed())) redirect("/admin/login");
  return (
    <div className="flex min-h-dvh flex-col bg-muted/40 md:flex-row">
      <Nav />
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}><Guard>{children}</Guard></Suspense>;
}
