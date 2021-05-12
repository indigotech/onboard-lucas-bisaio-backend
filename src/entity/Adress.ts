import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { User } from "./User";

@Entity()
export class Adress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  state: string;

  @Column()
  city: string;

  @Column()
  neighbour: string;

  @ManyToMany(() => User, (user) => user.adress)
  user?: string;
}
