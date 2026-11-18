import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class BootstrapAdminDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name: string;

  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsString()
  @MinLength(12)
  @MaxLength(72)
  password: string;

  @IsString()
  @MinLength(32)
  setupKey: string;
}
