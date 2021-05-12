import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Adress } from "./Adress";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  birthDate?: string;

  @OneToMany(() => Adress, (adress) => adress.user)
  adress: Adress[];
}
