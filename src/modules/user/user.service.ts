import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ElasticService } from '../elastic/elastic.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly elasticService: ElasticService
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const user = this.userRepo.create(dto);
    return this.userRepo.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  // ------------------------------
  // New: Seed multiple random users
  // ------------------------------
  async seedRandomUsers(count = 30) {
    const interestsList = ['hiking', 'reading', 'cooking', 'travel', 'photography'];
    const cuisineList = ['italian', 'japanese', 'chinese', 'mexican', 'indian'];

    // Center point (login user / default city)
    // const centerLat = 31.5204; // Lahore latitude
    // const centerLng = 74.3587; // Lahore longitude

    const centerLat = 33.6844;
const centerLng = 73.0479;


    const users: CreateUserDto[] = [];

    for (let i = 0; i < count; i++) {
      // Random location within 30km radius
      const { lat, lng } = this.getRandomLocation(centerLat, centerLng, 30);

      users.push({
        name: `User${i}`,
        email: `user${i}@example.com`,
        password: await bcrypt.hash('12345', 10), // default password
        gender: (Math.random() > 0.5 ? 'MALE' : 'FEMALE') as any,
        interests: this.getRandomArray(interestsList),
        cuisine: this.getRandomArray(cuisineList),
        lat,
        lng,
      });
    }

    await this.userRepo.save(users);

 const savedUsers = await this.userRepo.save(users);

for (const user of savedUsers) {
  await this.elasticService.indexDocument('users', user.id, {
    name: user.name,
    email: user.email,
    gender: user.gender,
    interests: user.interests,
    cuisine: user.cuisine,
    location: { lat: user.lat, lon: user.lng }, // geo_point
  });
}

    console.log(`${count} users seeded successfully!`);
  }
   
  // ------------------------------
  // Helper: Random location within radius
  // ------------------------------
  private getRandomLocation(lat: number, lng: number, radiusKm: number) {
    const r = radiusKm / 111; // ~1 deg latitude = 111km
    const u = Math.random();
    const v = Math.random();
    const w = r * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const newLat = lat + w * Math.cos(t);
    const newLng = lng + (w * Math.sin(t)) / Math.cos((lat * Math.PI) / 180);
    return { lat: newLat, lng: newLng };
  }

  // ------------------------------
  // Helper: Random array elements
  // ------------------------------
  private getRandomArray(arr: string[], maxItems = 3) {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * maxItems) + 1);
  }
}
