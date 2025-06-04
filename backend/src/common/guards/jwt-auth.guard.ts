import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any): any {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      // Log the error or info for debugging if needed
      // console.error('JWT Auth Guard Error:', err, 'Info:', info);
      throw err || new UnauthorizedException('Invalid or expired token. Please log in again.');
    }
    return user;
  }
}
