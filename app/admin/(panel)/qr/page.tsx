import QrManager from "@/components/admin/QrManager";

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl">QR Codes</h1>
        <p className="text-muted-foreground">Print the QR and place it next to the artwork. Scanning opens the slide presentation.</p>
      </div>
      <QrManager />
    </div>
  );
}
