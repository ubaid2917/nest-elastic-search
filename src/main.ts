import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {UserService } from './modules/user/user.service'


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   const userService = app.get(UserService);

  // Seed 300 random users
  await userService.seedRandomUsers(10);

  
  console.log('Seeding complete!');

  await app.listen(process.env.PORT ?? 3000);

 
  
}
bootstrap();
