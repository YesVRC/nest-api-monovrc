import { PassportStrategy } from "@nestjs/passport";
import {Strategy, Profile} from "passport-discord";
import { ConfigService } from "@nestjs/config";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { DoneCallback } from "passport";

@Injectable()
export class DiscordLoginStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService, private prismaService: PrismaService) {
    super({
      clientID: configService.get('DISCORD_CLIENT_ID'),
      clientSecret: configService.get('DISCORD_CLIENT_SECRET'),
      scope: ['identify', 'email'],
      callbackURL: configService.get('DISCORD_REDIRECT_URL'),

    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: DoneCallback){
    const exists = await this.prismaService.user.findFirst({where: { discordId: profile.id }});
    if(exists) return exists;
    throw new HttpException('Email does not match or discord ID not found on any account', HttpStatus.NOT_FOUND)
  }
}