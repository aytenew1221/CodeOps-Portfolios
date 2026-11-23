import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { UsersService } from '../users/users.service';
import { UserRole } from '../users/user-role.enum';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { BootstrapAdminDto } from './dto/bootstrap-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.usersService.createUser(
      dto.name.trim(),
      dto.email.trim().toLowerCase(),
      passwordHash,
      UserRole.STUDENT,
    );

    return {
      message: 'Student account created successfully',
      user: this.safeUser(user),
    };
  }

  async bootstrapAdmin(dto: BootstrapAdminDto) {
    const expectedKey = process.env.ADMIN_SETUP_KEY;

    if (!expectedKey || dto.setupKey !== expectedKey) {
      throw new UnauthorizedException('Invalid administrator setup key');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.usersService.createFirstAdmin(
      dto.name.trim(),
      dto.email.trim().toLowerCase(),
      passwordHash,
    );

    return {
      message: 'Administrator account created successfully',
      user: this.safeUser(user),
    };
  }

  async createStaff(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.usersService.createUser(
      dto.name.trim(),
      dto.email.trim().toLowerCase(),
      passwordHash,
      UserRole.STAFF,
    );

    return {
      message: 'Staff account created successfully',
      user: this.safeUser(user),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(
      dto.email.trim().toLowerCase(),
    );

    if (
      !user ||
      !user.isActive ||
      !(await bcrypt.compare(dto.password, user.passwordHash))
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',
      accessToken,
      tokenType: 'Bearer',
      user: this.safeUser(user),
    };
  }
  async getCurrentUser(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User account is unavailable');
    }

    return {
      user: this.safeUser(user),
    };
  }

  private safeUser(user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
  }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}
