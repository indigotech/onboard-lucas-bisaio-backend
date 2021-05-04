import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column()
  email: string;

  @Column()
  birthDate: string;
}
