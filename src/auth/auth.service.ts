import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRole } from '../user/user.schema';
import { SignupDto } from 'src/dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async signup(signupDto: SignupDto): Promise<void> {
    const { username, email, password } = signupDto;

    // Vérifiez si un utilisateur avec cet e-mail existe déjà
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new HttpException('Cette adresse e-mail est déjà utilisée.', HttpStatus.CONFLICT);
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new this.userModel({ username, email,role: UserRole.USER,password: hashedPassword });
      await newUser.save();
    } catch (error) {
      throw new HttpException('Échec de l\'inscription. Veuillez réessayer.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(username: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ username }).exec();
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }
}
