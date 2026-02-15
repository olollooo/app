export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { superbaseRouteClient } from "../../../../lib/superbase/superbase-route";
import { logger } from '../../../../lib/logs/logger';

export async function DELETE() {
  const response = NextResponse.json({});

  try {
    const supabase = await superbaseRouteClient(response);

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!user || error) {
      return NextResponse.json(
        { code: "AUTH_REQUIRED", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: deleteError } =
      await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (deleteError) {
      logger.error({ error }, 'superbase deleteUser');
      return NextResponse.json(
        { code: "DELETE_FAILED", message: "Failed to delete user" },
        { status: 500 }
      );
    }

    await supabase.auth.signOut();

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'superbase signOut failed');
    return NextResponse.json(
      { code: "INTERNAL_ERROR", message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
