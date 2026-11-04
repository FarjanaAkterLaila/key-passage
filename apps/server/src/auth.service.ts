import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

type Account = { email: string; passwordHash: string };

const filePath = join(process.cwd(), 'data', 'accounts.json');

@Injectable()
export class AuthService {
  private async readAccounts(): Promise<Account[]> {
    try {
      const raw = await readFile(filePath, 'utf8');
      return JSON.parse(raw) as Account[];
    } catch {
      return [];
    }
  }

  private async writeAccounts(accounts: Account[]) {
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, JSON.stringify(accounts, null, 2));
  }

  private hash(password: string, salt = randomBytes(16).toString('hex')) {
    const hashed = scryptSync(password, salt, 32).toString('hex');
    return `${salt}:${hashed}`;
  }

  private matches(password: string, stored: string) {
    const [salt, hashed] = stored.split(':');
    const next = scryptSync(password, salt, 32);
    const current = Buffer.from(hashed, 'hex');
    return current.length === next.length && timingSafeEqual(current, next);
  }

  async register(email: string, password: string) {
    const accounts = await this.readAccounts();
    const normalized = email.trim().toLowerCase();
    if (accounts.some((account) => account.email === normalized)) {
      throw new ConflictException('An account with this email already exists.');
    }
    accounts.push({ email: normalized, passwordHash: this.hash(password) });
    await this.writeAccounts(accounts);
    return { email: normalized };
  }

  async login(email: string, password: string) {
    const accounts = await this.readAccounts();
    const account = accounts.find((item) => item.email === email.trim().toLowerCase());
    if (!account || !this.matches(password, account.passwordHash)) {
      throw new UnauthorizedException('Email or password is wrong.');
    }
    return { email: account.email };
  }
}
