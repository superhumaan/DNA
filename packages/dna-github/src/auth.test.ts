import { mkdtemp, readFile, rm } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const execMock = vi.hoisted(() => vi.fn());
const fetchMock = vi.hoisted(() => vi.fn());

vi.mock("node:child_process", () => ({
  exec: execMock,
  spawn: vi.fn(),
}));

vi.mock("node:util", () => ({
  promisify: () => execMock,
}));

vi.mock("node:os", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:os")>();
  return {
    ...actual,
    homedir: () => join(tmpdir(), "dna-auth-test-home"),
  };
});

describe("GitHub auth", () => {
  let home: string;

  beforeEach(async () => {
    home = join(tmpdir(), `dna-auth-test-home-${Date.now()}`);
    await mkdtemp(home);
    execMock.mockReset();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(async () => {
    vi.unstubAllGlobals();
    await rm(join(tmpdir(), "dna-auth-test-home"), { recursive: true, force: true }).catch(() => {});
  });

  it("adopts an existing GitHub CLI session during login", async () => {
    execMock.mockImplementation(async (cmd: string) => {
      if (cmd === "gh auth token") return { stdout: "gho_test_token\n" };
      if (cmd === "gh --version") return { stdout: "gh version 2.0.0\n" };
      throw new Error(`unexpected command: ${cmd}`);
    });
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ login: "superhumaan" }),
    });

    const { loginWithWebFlow } = await import("./auth.js");
    const messages: string[] = [];
    const result = await loginWithWebFlow({
      force: true,
      onStatus: (msg) => messages.push(msg),
    });

    expect(messages).toContain("Using existing GitHub CLI session...");
    expect(result.username).toBe("superhumaan");
    expect(result.credentials.method).toBe("gh_cli");

    const saved = JSON.parse(
      await readFile(join(homedir(), ".config", "dna", "github-credentials.json"), "utf-8"),
    ) as { token: string; username: string; method: string };
    expect(saved.token).toBe("gho_test_token");
    expect(saved.username).toBe("superhumaan");
    expect(saved.method).toBe("gh_cli");
  });

  it("persists GitHub CLI credentials when resolving a token", async () => {
    execMock.mockImplementation(async (cmd: string) => {
      if (cmd === "gh auth token") return { stdout: "gho_resolve_token\n" };
      throw new Error(`unexpected command: ${cmd}`);
    });
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ login: "dna-user" }),
    });

    const { resolveGitHubToken } = await import("./auth.js");
    const creds = await resolveGitHubToken();

    expect(creds?.token).toBe("gho_resolve_token");
    expect(creds?.method).toBe("gh_cli");
    expect(creds?.username).toBe("dna-user");

    const saved = JSON.parse(
      await readFile(join(homedir(), ".config", "dna", "github-credentials.json"), "utf-8"),
    ) as { token: string };
    expect(saved.token).toBe("gho_resolve_token");
  });
});
