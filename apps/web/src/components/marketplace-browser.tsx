"use client";

import { useMemo, useState } from "react";
import type { KnowledgePack } from "@superhumaan/dna-config";

const CATEGORIES = [
  "all",
  "frameworks",
  "platforms",
  "disciplines",
  "compliance",
  "languages",
  "cms",
  "browsers",
  "payments",
  "data",
  "healthcare",
  "enterprise",
  "cloud",
  "databases",
  "ai",
  "gaming",
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  frameworks: "Frameworks",
  platforms: "Platforms",
  disciplines: "Disciplines",
  compliance: "Compliance",
  languages: "Languages",
  cms: "CMS",
  browsers: "Browsers",
  payments: "Payments",
  data: "Data & DR",
  healthcare: "Healthcare",
  enterprise: "Enterprise",
  cloud: "Cloud",
  databases: "Databases",
  ai: "AI & LLM",
  gaming: "Gaming",
};

type Category = (typeof CATEGORIES)[number];

function matchesCategory(p: KnowledgePack, category: Category): boolean {
  if (category === "all") return true;
  if (category === "cms" && (p.tags.includes("cms") || p.id.startsWith("cms/"))) return true;
  if (category === "browsers" && (p.tags.includes("browser") || p.id.startsWith("browsers/"))) return true;
  if (category === "payments" && (p.tags.includes("payments") || p.id.startsWith("payments/"))) return true;
  if (
    category === "data" &&
    (p.id.startsWith("data/") ||
      p.tags.includes("data-hq") ||
      p.tags.includes("geo-replication") ||
      p.tags.includes("disaster-recovery"))
  ) {
    return true;
  }
  if (category === "healthcare" && (p.id.startsWith("healthcare/") || p.tags.includes("healthcare"))) return true;
  if (
    category === "enterprise" &&
    (p.id.startsWith("erp/") ||
      p.id.startsWith("hr/") ||
      p.id.startsWith("legal/") ||
      p.id.startsWith("crm/") ||
      p.tags.includes("enterprise"))
  ) {
    return true;
  }
  if (category === "cloud" && (p.id.startsWith("cloud/") || p.tags.includes("cloud"))) return true;
  if (category === "databases" && (p.id.startsWith("databases/") || p.tags.includes("databases"))) return true;
  if (category === "ai" && (p.id.startsWith("ai/") || p.tags.includes("ai"))) return true;
  if (category === "gaming" && (p.id.startsWith("gaming/") || p.tags.includes("gaming"))) return true;
  return p.category === category;
}

function maturityLabel(p: KnowledgePack): string | null {
  if (p.tags.includes("legacy")) return "legacy";
  if (p.tags.includes("emerging")) return "emerging";
  if (p.tags.includes("mainstream")) return "mainstream";
  return null;
}

function InstallCommand({ packId }: { packId: string }) {
  const cmd = `dna marketplace install ${packId}`;
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(cmd);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="mt-4 w-full rounded-lg border border-dna-border bg-dna-bg px-3 py-2 text-left font-mono text-xs text-dna-accent hover:border-dna-accent/50 transition-colors"
      title="Copy install command"
    >
      {copied ? "Copied!" : cmd}
    </button>
  );
}

function PackCard({ pack, expanded, onToggle }: { pack: KnowledgePack; expanded: boolean; onToggle: () => void }) {
  const maturity = maturityLabel(pack);

  return (
    <article className="rounded-2xl border border-dna-border bg-dna-surface/60 overflow-hidden hover:border-dna-accent/25 transition-colors">
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-dna-accent/50"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-mono text-dna-muted mb-1">{pack.id}</p>
            <h3 className="font-display text-lg font-semibold text-dna-text">{pack.name}</h3>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <span className="rounded-full bg-dna-accent/10 px-2.5 py-0.5 text-xs font-medium text-dna-accent capitalize">
              {pack.category}
            </span>
            {maturity && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                  maturity === "legacy"
                    ? "bg-amber-500/15 text-amber-600"
                    : maturity === "emerging"
                      ? "bg-violet-500/15 text-violet-600"
                      : "bg-dna-border/80 text-dna-muted"
                }`}
              >
                {maturity}
              </span>
            )}
          </div>
        </div>
        <p className="mt-2 text-sm text-dna-muted leading-relaxed line-clamp-2">{pack.description}</p>
        <p className="mt-3 text-xs text-dna-muted">
          v{pack.version} · {pack.files.length} file{pack.files.length === 1 ? "" : "s"}
        </p>
      </button>
      {expanded && (
        <div className="border-t border-dna-border px-5 pb-5 pt-4">
          <p className="text-sm text-dna-muted mb-3">{pack.description}</p>
          <p className="text-xs font-medium text-dna-text mb-2">Files installed to .DNA/knowledge/</p>
          <ul className="max-h-40 overflow-y-auto space-y-1 text-xs font-mono text-dna-muted">
            {pack.files.map((f) => (
              <li key={f.path} className="truncate">
                {f.path}
              </li>
            ))}
          </ul>
          <InstallCommand packId={pack.id} />
        </div>
      )}
    </article>
  );
}

export function MarketplaceBrowser({ packs }: { packs: KnowledgePack[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return packs.filter((p) => {
      if (!matchesCategory(p, category)) return false;
      if (!q) return true;
      return (
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [packs, query, category]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="search"
          placeholder="Search packs…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-xl border border-dna-border bg-dna-bg px-4 py-3 text-sm text-dna-text placeholder:text-dna-muted focus:border-dna-accent/50 focus:outline-none focus:ring-1 focus:ring-dna-accent/30"
        />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                category === cat
                  ? "bg-dna-accent text-dna-bg"
                  : "border border-dna-border text-dna-muted hover:text-dna-text"
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-dna-muted mb-6">
        {filtered.length} pack{filtered.length === 1 ? "" : "s"}
        {query ? ` matching “${query}”` : ""}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((pack) => (
          <PackCard
            key={pack.id}
            pack={pack}
            expanded={expandedId === pack.id}
            onToggle={() => setExpandedId((id) => (id === pack.id ? null : pack.id))}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-dna-muted py-16">No packs match your search.</p>
      )}
    </div>
  );
}
