import { pbkdf2Sync, randomBytes } from 'crypto';

export class PasswordHasher {
  static hasher(password: string, salt: string): string {
    return pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  }

  static createHashedPassword(password: string): {
    hashedPassword: string;
    salt: string;
  } {
    const salt = randomBytes(16).toString('hex');
    const hashedPassword = this.hasher(password, salt);
    return {
      hashedPassword,
      salt,
    };
  }

  static validate(
    password: string,
    salt: string,
    hashedPassword: string
  ): boolean {
    return this.hasher(password, salt) === hashedPassword;
  }
}
