export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { superbaseRouteClient } from "../../../../lib/superbase/superbase-route";
import { logger } from '../../../../lib/logs/logger';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const redirect = url.searchParams.get("redirect") ?? "/chat";

  if (!code) {
    return NextResponse.redirect(new URL("/login", url.origin));
  }

  const response = NextResponse.redirect(new URL(redirect, url.origin));

  const supabase = await superbaseRouteClient(response);
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    logger.error({ error }, 'superbase exchangeCodeForSession failed');
    return NextResponse.redirect(new URL("/login", url.origin));
  }

  return response;
}
