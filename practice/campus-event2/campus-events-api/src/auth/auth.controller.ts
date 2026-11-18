
import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { BootstrapAdminDto } from './dto/bootstrap-admin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('bootstrap-admin')
  bootstrapAdmin(@Body() dto: BootstrapAdminDto) {
    return this.authService.bootstrapAdmin(dto);
  }

  @Post('staff')
  createStaff(@Body() dto: RegisterDto) {
    return this.authService.createStaff(dto);
  }
}
