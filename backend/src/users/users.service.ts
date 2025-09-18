import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async findByEmail(email: string) {
        try {
            return await this.prisma.user.findUnique({
                where: { email }
            });
        } catch (error) {
            console.error('Error finding user by email:', error);
            return null;
        }
    }

    async findById(id: number) {
        try {
            return await this.prisma.user.findUnique({
                where: { id }
            });
        } catch (error) {
            console.error('Error finding user by id:', error);
            return null;
        }
    }

    async createUser(email: string, password: string, name?: string) {
        try {
            return await this.prisma.user.create({
                data: {
                    email,
                    password,
                    name: name || null
                }
            });
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Failed to create user');
        }
    }

}
