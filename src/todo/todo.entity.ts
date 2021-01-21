import { Entity, Column, PrimaryColumn, Generated } from 'typeorm';

@Entity({name: 'tbl_todo_tasks'})
export class Todo {
  @PrimaryColumn()
  id: string;

  @Column()
  type: string;

  @Column()
  text: string;
}
