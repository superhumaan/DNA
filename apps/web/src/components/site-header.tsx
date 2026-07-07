import Link from "next/link";

const NAV = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "https://github.com/superhumaan/DNA", label: "GitHub", external: true },
  { href: "https://github.com/superhumaan/DNA/tree/main/docs", label: "Docs", external: true },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-dna-border/80 bg-dna-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-dna-accent/15 text-dna-accent font-display font-bold text-sm ring-1 ring-dna-accent/30">
            DNA
          </span>
          <span className="font-display font-semibold tracking-tight text-dna-text group-hover:text-white transition-colors">
            by Humaan
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {NAV.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg px-3 py-2 text-sm text-dna-muted hover:text-dna-text hover:bg-dna-surface transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm text-dna-muted hover:text-dna-text hover:bg-dna-surface transition-colors"
              >
                {item.label}
              </Link>
            ),
          )}
          <Link
            href="/marketplace"
            className="ml-2 hidden sm:inline-flex rounded-lg bg-dna-accent px-4 py-2 text-sm font-medium text-dna-bg hover:bg-emerald-300 transition-colors"
          >
            Browse packs
          </Link>
        </nav>
      </div>
    </header>
  );
}
