import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'defaultSecretKeyPleaseChangeInProduction32Chars',
  signOptions: {
    expiresIn: process.env.JWT_EXPIRATION_TIME || '3600s', // e.g., 60s, 10h, 7d
  },
}));
