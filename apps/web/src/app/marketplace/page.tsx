import type { Metadata } from "next";
import { getBundledCatalog } from "@superhumaan/dna-core";
import { MarketplaceBrowser } from "@/components/marketplace-browser";

export const metadata: Metadata = {
  title: "Knowledge Marketplace",
  description: "Browse and install curated DNA knowledge packs for frameworks, compliance, and Humaan production patterns.",
};

export default function MarketplacePage() {
  const catalog = getBundledCatalog("stable");

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <div className="mb-12">
        <p className="text-sm font-medium uppercase tracking-widest text-dna-accent mb-3">
          Knowledge packs
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Marketplace</h1>
        <p className="mt-4 max-w-2xl text-dna-muted leading-relaxed">
          Curated guidance installs into <code className="text-dna-accent text-sm">.DNA/knowledge/</code>.
          DNA auto-installs foundation packs on init; browse here for optional depth.
        </p>
        <div className="mt-6 rounded-xl border border-dna-border bg-dna-surface/50 p-4 font-mono text-sm">
          <span className="text-dna-muted">CLI: </span>
          <span className="text-dna-text">dna marketplace list</span>
          <span className="text-dna-muted"> · </span>
          <span className="text-dna-text">dna marketplace install &lt;pack-id&gt;</span>
        </div>
      </div>

      <MarketplaceBrowser packs={catalog.packs} />

      <section className="mt-16 rounded-2xl border border-dna-border bg-dna-surface/30 p-6">
        <h2 className="font-display text-lg font-semibold mb-2">API</h2>
        <p className="text-sm text-dna-muted mb-4">The CLI fetches from this host when online.</p>
        <ul className="space-y-2 font-mono text-xs text-dna-muted">
          <li>
            <span className="text-dna-accent">GET</span> /marketplace/api/v1/catalog?channel=stable
          </li>
          <li>
            <span className="text-dna-accent">GET</span> /marketplace/api/v1/packs/{"{packId}"}
          </li>
        </ul>
      </section>
    </div>
  );
}
