import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-dna-border mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-dna-muted">
        <p>
          MIT © {new Date().getFullYear()}{" "}
          <a
            href="https://humaan.com"
            className="text-dna-text hover:text-dna-accent transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Humaan by Superlite
          </a>
        </p>
        <div className="flex gap-6">
          <Link href="/marketplace" className="hover:text-dna-accent transition-colors">
            Marketplace
          </Link>
          <a
            href="https://github.com/superhumaan/DNA"
            className="hover:text-dna-accent transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
