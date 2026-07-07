import { NextResponse } from "next/server";
import { getBundledPack } from "@superhumaan/dna-core";

export const runtime = "nodejs";

type Params = { params: Promise<{ packId: string[] }> };

export async function GET(_request: Request, { params }: Params) {
  const { packId: segments } = await params;
  const packId = segments.map(decodeURIComponent).join("/");
  const pack = getBundledPack(packId);

  if (!pack) {
    return NextResponse.json({ error: `Pack not found: ${packId}` }, { status: 404 });
  }

  return NextResponse.json(pack, {
    headers: {
      "Cache-Control": "public, max-age=300",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    },
  });
}
