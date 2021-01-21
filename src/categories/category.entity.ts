import {Entity, Column, Index, PrimaryGeneratedColumn} from "typeorm";
import { CategoryTypeDto } from './dto/category.type.dto';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id?: number;

  @Index()
  @Column({default: 0})
  parent: number;

  @Column()
  name: string;

  @Index()
  @Column('enum', {enum: CategoryTypeDto})
  type: CategoryTypeDto;
}
