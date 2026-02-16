export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { superbaseRouteClient } from "../../../../lib/superbase/superbase-route";

export async function POST() {
  try {
    const response = NextResponse.json({ ok: true });

    const supabase = await superbaseRouteClient(response);
    await supabase.auth.signOut();

    return response;
  } catch (err) {
    console.error('superbase signOut failed', { err });

    return NextResponse.json(
      { code: "INTERNAL_ERROR", message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
