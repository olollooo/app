import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { createClient } from "@supabase/supabase-js";

@Injectable()
export class OptionalUserGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const auth = req.headers["authorization"];

    if (!auth?.startsWith("Bearer ")) {
      req.user = null;
      return true;
    }
		
		const supabase = createClient(
			process.env.SUPABASE_URL!,
			process.env.SUPABASE_SERVICE_ROLE_KEY!
		);

    const token = auth.slice(7);

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      req.user = null;
      return true;
    }

    req.user = {
      id: data.user.id,
      email: data.user.email,
    };
    return true;
  }
}
