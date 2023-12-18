import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtVerifyMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  async use(req, res: Response, next: NextFunction): Promise<void | Error> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new UnauthorizedException({ message: 'User is not authorized.' });
      }
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];
      console.log(bearer, token);
      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({ message: 'User is not authorized.' });
      }

      const user = this.jwtService.verify(token);
      console.log(user);
      req.user = user;

      next();
    } catch (e) {
      console.log(1234);
      next(e);
      // throw new UnauthorizedException({message: "User is not authorized."})
    }
  }
}
