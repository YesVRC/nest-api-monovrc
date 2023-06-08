import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { RegisterUserLocalDto } from './dto/registerUserLocal.dto';
import { LocalLoginDto } from './dto/localLogin.dto';
import { AuthService } from './auth.service';
import { Request, Response } from "express";
import { DiscordLoginGuard } from "./passport/discord.login.guard";
import { LocalGuard } from "./passport/local.guard";

// TODO: Make routes for local login, discord login //
// TODO: Make routes for JWT refresh token //
// TODO: Make guard for logins and JWT access token //

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register/local')
  async registerLocal(@Body() data: RegisterUserLocalDto, @Req() req: Request) {
    return await this.authService.registerLocal(data, req);
  }
  @Post('/login/local')
  async loginLocal(@Body() data: LocalLoginDto, @Req() req: Request) {
    return await this.authService.loginLocal(data, req);
  }

  @Get('/login/discord')
  async loginDiscord(@Res() response: Response){
    return await this.authService.loginDiscord(response);
  }
  @Get('/link/discord')
  async discordLink(@Res() response: Response, @Query('code') code: string){
    return 'test';
  }



}
