import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @description Custom decorator to extract the authenticated user object from the request.
 * This decorator should be used in conjunction with routes protected by JwtAuthGuard.
 * It simplifies accessing the user payload that was attached to the request by the guard.
 *
 * @example
 * ```typescript
 * 
 * @Get('profile')
 * @UseGuards(JwtAuthGuard)
 * getProfile(@User() user: UserEntity) {
 *   return user;
 * }
 * 
 * @Get('userId')
 * @UseGuards(JwtAuthGuard)
 * getUserId(@User('id') userId: string) {
 *  return userId;
 * }
 * ```
 */
export const User = createParamDecorator(
  (data: keyof any | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // If a specific property of the user object is requested (e.g., @User('id'))
    // return that property. Otherwise, return the whole user object.
    return data ? user?.[data] : user;
  },
);
