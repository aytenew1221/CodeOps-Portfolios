import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { readFile, writeFile, rename, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

import { User, UsersFile } from './user.interface';
import { UserRole } from './user-role.enum';

export type SafeUser = Omit<User, 'passwordHash'>;

@Injectable()
export class UsersService {
  private readonly filePath = join(process.cwd(), 'data', 'users.json');

  private writeQueue: Promise<void> = Promise.resolve();

  private async withWriteLock<T>(operation: () => Promise<T>): Promise<T> {
    let release!: () => void;
    const previous = this.writeQueue;

    this.writeQueue = new Promise<void>((resolve) => {
      release = resolve;
    });

    await previous;

    try {
      return await operation();
    } finally {
      release();
    }
  }

  private async readData(): Promise<UsersFile> {
    try {
      const content = await readFile(this.filePath, 'utf8');
      return JSON.parse(content.replace(/^\uFEFF/, '')) as UsersFile;
    } catch (error) {
      console.error('Could not read users.json:', error);
      throw new InternalServerErrorException('Could not read user data');
    }
  }

  private async writeData(data: UsersFile): Promise<void> {
    const temporaryPath = `${this.filePath}.${randomUUID()}.tmp`;

    try {
      await writeFile(
        temporaryPath,
        JSON.stringify(data, null, 2) + '\n',
        'utf8',
      );

      await rename(temporaryPath, this.filePath);
    } catch (error) {
      try {
        await unlink(temporaryPath);
      } catch {
        // Ignore cleanup errors.
      }

      console.error('Could not save users.json:', error);
      throw new InternalServerErrorException('Could not save user data');
    }
  }

  private toSafeUser(user: User): SafeUser {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  private createUserRecord(
    data: UsersFile,
    name: string,
    email: string,
    passwordHash: string,
    role: UserRole,
  ): User {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = data.users.find(
      (user) => user.email.toLowerCase() === normalizedEmail,
    );

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const user: User = {
      id: randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    data.users.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const data = await this.readData();

    return data.users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async findById(id: string): Promise<User | undefined> {
    const data = await this.readData();
    return data.users.find((user) => user.id === id);
  }

  async hasAdmin(): Promise<boolean> {
    const data = await this.readData();
    return data.users.some((user) => user.role === UserRole.ADMIN);
  }

  async findAllSafe(): Promise<SafeUser[]> {
    const data = await this.readData();
    return data.users.map((user) => this.toSafeUser(user));
  }

  async updateUserStatus(id: string, isActive: boolean): Promise<SafeUser> {
    return this.withWriteLock(async () => {
      const data = await this.readData();
      const user = data.users.find((item) => item.id === id);

      if (!user) {
        throw new NotFoundException('User account not found');
      }

      if (!isActive && user.role === UserRole.ADMIN && user.isActive) {
        const anotherActiveAdmin = data.users.some(
          (item) =>
            item.id !== user.id &&
            item.role === UserRole.ADMIN &&
            item.isActive,
        );

        if (!anotherActiveAdmin) {
          throw new ConflictException(
            'Cannot deactivate the last active administrator',
          );
        }
      }

      user.isActive = isActive;
      await this.writeData(data);

      return this.toSafeUser(user);
    });
  }

  async createFirstAdmin(
    name: string,
    email: string,
    passwordHash: string,
  ): Promise<User> {
    return this.withWriteLock(async () => {
      const data = await this.readData();

      const adminExists = data.users.some(
        (user) => user.role === UserRole.ADMIN,
      );

      if (adminExists) {
        throw new ConflictException('An administrator account already exists');
      }

      const user = this.createUserRecord(
        data,
        name,
        email,
        passwordHash,
        UserRole.ADMIN,
      );

      await this.writeData(data);
      return user;
    });
  }

  async createUser(
    name: string,
    email: string,
    passwordHash: string,
    role: UserRole,
  ): Promise<User> {
    return this.withWriteLock(async () => {
      const data = await this.readData();

      const user = this.createUserRecord(data, name, email, passwordHash, role);

      await this.writeData(data);
      return user;
    });
  }
}
