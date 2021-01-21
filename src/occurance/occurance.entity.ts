import {Entity, Column, Index, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Occurance {
  @PrimaryGeneratedColumn()
  id?: number;

  @Index()
  @Column({default: 0})
  parent: number;

  @Column()
  name: string;
}
