import { JwtGuard } from './jwt.guard';
import { Injectable, ExecutionContext } from '@nestjs/common';
@Injectable()
export class OptionalJwtGuard extends JwtGuard {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    try {
      await super.canActivate(context);
    } catch (e) {}
    return true;
  }
}
