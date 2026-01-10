import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Gender } from '../enums/user.enum';
@Entity('user')
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({})
  gender: Gender;

  @Column('simple-array', { nullable: true })
  interests: string[];

  @Column('simple-array', { nullable: true })
  cuisine: string[];

  @Column('decimal', { precision: 9, scale: 6, nullable: true })
  lat: number;

  @Column('decimal', { precision: 9, scale: 6, nullable: true })
  lng: number;
}
