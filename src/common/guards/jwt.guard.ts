import { CanActivate, ExecutionContext, Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserService } from '../../user/user.service';
import { JwtPayload } from '../dto/jwt.payload';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(@Inject('UserService') private readonly userSrv: UserService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const {req} = ctx.getContext();
    const payload: JwtPayload = AuthService.validateToken(req.headers['access-token']);
    if (!payload) {
      throw new UnauthorizedException();
    }
    req.user = await this.userSrv.findById(payload.id);
    return !!payload;
  }
}
