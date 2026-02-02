import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { createClient } from "@supabase/supabase-js";

@Injectable()
export class RequiredUserGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const auth = req.headers["authorization"];

    if (!auth?.startsWith("Bearer ")) {
      throw new UnauthorizedException({
        code: "AUTH_REQUIRED",
        message: "User must be logged in"
      });
    }

    const token = auth.slice(7);

		const supabase = createClient(
			process.env.SUPABASE_URL!,
			process.env.SUPABASE_SERVICE_ROLE_KEY!
		);

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedException({
        code: "INVALID_TOKEN",
        message: "Invalid or expired token"
      });
    }

    req.user = {
      id: data.user.id,
      email: data.user.email,
    };

    return true;
  }
}
