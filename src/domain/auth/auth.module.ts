import { Module } from '@nestjs/common';
import { AmoCrmModule } from 'src/external/amo-crm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service.';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
  imports: [AmoCrmModule],
})
export class AuthModule {}
