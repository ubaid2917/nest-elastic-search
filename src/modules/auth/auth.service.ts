import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService
    ){} 

    async hashedPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }

    async registerUser(createUserDto: CreateUserDto) {
        const hashedPassword = await this.hashedPassword(createUserDto.password);
        return this.userService.createUser({
            ...createUserDto,
            password: hashedPassword
        });
    }
}
