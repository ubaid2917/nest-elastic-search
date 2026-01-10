import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) 
        private readonly userRepo: Repository<User>
    ){}  

    async findByEmail(email: string): Promise<User | null>{
        return this.userRepo.findOne({ where: { email } });
    }
}
