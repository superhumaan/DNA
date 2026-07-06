export function generateTemplateFiles(): Record<string, string> {
  return {
    "templates/impressions/product-overview.template.md": `# Product Overview

{{projectName}}

{{description}}
`,
    "templates/impressions/architecture.template.md": `# Solution Architecture

Frontend: {{frontend}}
Backend: {{backend}}
Database: {{database}}
`,
    "templates/behaviour-snippet.md": `# Behaviour Snippet

Copy relevant sections into Behaviour files when extending DNA rules.
`,
  };
}
