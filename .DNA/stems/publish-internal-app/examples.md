# Examples

## Example 1

**User:** Publish the internal app

**Good response shape:**
Found npm script publish:internal. Dry run succeeded for the environment in .env.example. Live publish printed the release URL. Recorded in .DNA/plans/internal-publish.md.

## Example 2

**User:** Skip the dry run, just push it

**Good response shape:**
Dry run still runs first. If it fails I will not publish. No host was assumed.

## Example 3

**User:** Deploy wherever we deployed the other product

**Good response shape:**
Stopped. This repo has no publish script, and I will not copy another product's host. Add a script here or point me at one.
