import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './../user/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = this.jwtService.sign({ email });

    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      verificationToken,
    });

    await newUser.save();
    await this.sendVerificationEmail(email, verificationToken);
    return { message: 'Registration successful, verify your email' };
  }

  // Login
  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new BadRequestException('Email not verified');
    }

    const token = this.jwtService.sign({ email: user.email, sub: user._id });
    return { access_token: token };
  }

  async verifyEmail(token: string) {
    const payload = this.jwtService.verify(token);
    const user = await this.userModel.findOne({ email: payload.email });

    if (!user || user.isVerified) {
      throw new BadRequestException('Invalid token');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    return { message: 'Email verified successfully' };
  }

  async sendVerificationEmail(email: string, token: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const url = `http://localhost:3000/auth/verify-email?token=${token}`;

    await transporter.sendMail({
      from: '"Your App" <noreply@yourapp.com>',
      to: email,
      subject: 'Email Verification',
      html: `Click <a href="${url}">here</a> to verify your email.`,
    });
  }
}
