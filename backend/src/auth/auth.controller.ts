import {Controller, Post, Body, BadRequestException, UnauthorizedException} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
    ) {}

    @Post('register')
    async register(@Body() body: { email: string; password: string; name?: string }) {
        // Проверяем, что все обязательные поля заполнены
        if (!body.email || !body.password) {
            throw new BadRequestException('Email and password are required');
        }

        // Проверяем, что пользователь с таким email еще не существует
        const existingUser = await this.usersService.findByEmail(body.email);
        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }

        // Проверяем минимальную длину пароля
        if (body.password.length < 6) {
            throw new BadRequestException('Password must be at least 6 characters long');
        }

        try {
            const hashed = await bcrypt.hash(body.password, 10);
            const user = await this.usersService.createUser(body.email, hashed, body.name);
            return this.authService.login(user);
        } catch (error) {
            throw new BadRequestException('Failed to create user');
        }
    }
    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        if (!body.email || !body.password) {
            throw new BadRequestException('Email and password are required');
        }

        const user = await this.authService.validateUser(body.email, body.password);

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return this.authService.login(user);
    }

}
