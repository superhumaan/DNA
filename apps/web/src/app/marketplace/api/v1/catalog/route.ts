import { NextResponse } from "next/server";
import { MARKETPLACE_API_VERSION } from "@superhumaan/dna-config";
import { getBundledCatalog } from "@superhumaan/dna-core";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channel = (searchParams.get("channel") ?? "stable") as "stable" | "beta" | "nightly";
  const catalog = getBundledCatalog(channel);

  return NextResponse.json(
    {
      ...catalog,
      source: "remote" as const,
      marketplaceUrl: "https://dna.humaan.app/marketplace",
      apiVersion: MARKETPLACE_API_VERSION,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=300",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Accept",
    },
  });
}
