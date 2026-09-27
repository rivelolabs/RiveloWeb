import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function LegalPage({ html }: { html: string }) {
  return (
    <main className="relative min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      <div className="mesh-gradient" />
      <div className="relative z-10 mx-auto max-w-4xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
        <article className="card legal-document p-6 sm:p-10 lg:p-12" style={{ color: "var(--text-secondary)" }}>
          <div className="badge mb-6"><Shield className="h-3.5 w-3.5" /> Klyq</div>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </article>
      </div>
    </main>
  );
}
