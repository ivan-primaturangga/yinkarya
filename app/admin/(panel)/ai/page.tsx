import AiStudio from "@/components/admin/AiStudio";

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl">AI Studio</h1>
        <p className="text-muted-foreground">How AI helps artisans publish their stories. Concept demos for presentation.</p>
      </div>
      <AiStudio />
    </div>
  );
}
