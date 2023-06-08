import { PassportStrategy } from "@nestjs/passport";
import {Strategy} from "passport-local";
import { ConfigService } from "@nestjs/config";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import * as bcrypt from 'bcrypt'
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService, private prismaService: PrismaService) {
    super();
  }

  async validate(username: string, password: string){
    const exists = await this.prismaService.user.findFirst({where: {
      OR: [{username: {equals: username, mode: 'insensitive'}},{email: {equals: username, mode: 'insensitive'}}]
      }})
    if (!exists)
      throw new HttpException('User does not exist.', HttpStatus.NOT_FOUND);

    const compare = bcrypt.compare(password, exists.hashPass)
    if (!compare)
      throw new HttpException('Password is incorrect', HttpStatus.FORBIDDEN)

    delete exists.hashPass
    return exists;
  }
}