import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class DiscordLoginGuard extends AuthGuard('discordLogin'){
  constructor(private authService: AuthService) {
    super();
  }
  async canActivate(context: ExecutionContext):Promise<boolean> {
    const activate = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await this.authService.genTokens(request.user.id, context.switchToHttp().getResponse())
    return Promise.resolve(activate)
  }
}