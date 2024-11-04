import { Controller, Post, Body, HttpStatus, HttpException, ValidationPipe, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from 'src/dto/auth.dto';
import { User } from 'src/user/user.schema';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ValidationPipe()) // Apply validation pipe
  async signup(@Body() signupDto: SignupDto): Promise<void> {
    try {
      await this.authService.signup(signupDto);
    } catch (error) {
      throw new HttpException('L\'inscription a échoué', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: LoginDto): Promise<{ token: string } | null> {
    const user = await this.authService.login(loginDto.username, loginDto.password);
    if (!user) {
      throw new HttpException('Identifiants invalides', HttpStatus.UNAUTHORIZED);
    }
    const token = this.generateToken(user);
    return { token };
  }

  private generateToken(user: User): string {
    const payload = { username: user.username, sub: user._id };
    return jwt.sign(payload, 'secretKey', { expiresIn: '1h' });
  }
}
