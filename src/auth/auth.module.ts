import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from "@nestjs/config";
import { DiscordLoginStrategy } from "./passport/discord.login.strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./passport/jwt.strategy";
import { LocalStrategy } from "./passport/local.strategy";
@Module({
  imports: [PrismaModule, JwtModule, ConfigModule, PassportModule.register({session: false})],
  controllers: [AuthController],
  providers: [AuthService, DiscordLoginStrategy, JwtStrategy, LocalStrategy],
})
export class AuthModule {}
