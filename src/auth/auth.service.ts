import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LocalLoginDto } from './dto/localLogin.dto';
import { RegisterUserLocalDto } from './dto/registerUserLocal.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from "@prisma/client";
import { Request, Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService, private jwtService: JwtService, private configService: ConfigService) {}
  async createAuthToken(userId: string): Promise<string> {
    const token = await this.jwtService.signAsync({userId: userId}, {secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'), expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')})
    return Promise.resolve(`Authentication=Bearer ${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`);
  }
  async createRefreshToken(userId: string): Promise<string>
  {
    const token = await this.jwtService.signAsync({userId: userId}, {secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'), expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')})
    return Promise.resolve(`Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`);
  }

  async genTokens(userId: string, res: Response): Promise<void>{
    const at = await this.createAuthToken(userId)
    const rt = await this.createRefreshToken(userId)
    res.set('Set-Cookie', [at, rt])
  }
  async loginLocal(data: LocalLoginDto, request: Request) {
    return Promise.resolve(request.user)
  }

  async registerLocal(data: RegisterUserLocalDto, request: Request) {
    const exists = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { username: { equals: data.username, mode: 'insensitive' } },
          { email: { equals: data.email, mode: 'insensitive' } },
        ],
      },
    });
    if (exists)
      throw new HttpException('User already exists', HttpStatus.FORBIDDEN);

    const user: User = await this.prismaService.user.create({
      data: {
        username: data.username,
        email: data.email,
        hashPass: await bcrypt.hash(data.password, 10)
      }
    })

    await this.genTokens(user.id, request.res)
    delete user.hashPass
    return Promise.resolve(user)
  }


  async loginDiscord(response: Response) {
    return this.configService.get('DISCORD_OAUTH_LINK_URL');
    //response.redirect(this.configService.get('DISCORD_OAUTH_LINK_URL'))
  }

  async linkDiscord(response: Response, code: string) {
    return 'test';
  }
}
