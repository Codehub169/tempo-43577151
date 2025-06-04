import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '../interfaces/token-payload.interface'; // Assumed to be created
// import { UsersService } from '../../users/users.service'; // Optional: to fetch full user object

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    // private readonly usersService: UsersService, // Inject if you want to return full User object from DB
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'), // Fetches from loaded jwtConfig
    });
  }

  async validate(payload: TokenPayload): Promise<TokenPayload> {
    // This method is called after the JWT is successfully verified.
    // The payload is the decoded JWT.
    // We could fetch the user from the database here to ensure they still exist and are active.
    // const user = await this.usersService.findById(payload.sub);
    // if (!user) {
    //   throw new UnauthorizedException('User not found or inactive');
    // }
    // For simplicity, we'll return the payload directly. The @User() decorator in controllers
    // will receive this payload. If a full user object is needed, the controller can fetch it.
    if (!payload || !payload.sub) {
        throw new UnauthorizedException('Invalid token payload');
    }
    return { sub: payload.sub, email: payload.email, roles: payload.roles }; // Ensure all expected fields are returned
  }
}
