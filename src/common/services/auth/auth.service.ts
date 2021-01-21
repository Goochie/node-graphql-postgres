import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { v4 as uuidv4 } from 'uuid';
export const JWT_SECRET = process.env.SEACRED || '_]Zb53"5.`W(;HGcpb^PWeT);yAnX8yB)`/^Ht%2';
export const JWT_EXPIRES = '1d';
@Injectable()
export class AuthService {
  private readonly SEACRED: string = process.env.SEACRED;
  private readonly SALT_ROUNDS: number = 10;

  generatePassword(password: string): Promise<string> {
    return bcrypt.hash(password + this.SEACRED, this.SALT_ROUNDS);
  }

  comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password + this.SEACRED, hash);
  }

  createToken(email: string, id: number) {
    return jwt.sign({ email, id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  }

  static validateToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return null
    }
  }

  generateResetToken(): string {
    return uuidv4();
  }

}
