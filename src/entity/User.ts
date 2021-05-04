import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Connection,
  BaseEntity,
} from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;
}

export async function createUser(database: Connection) {
  const user = new User();
  user.firstName = "Joao";
  user.lastName = "Silva";
  user.age = 35;

  const newUser = await database.manager.save(user);
  console.log("User has been saved. user id is", newUser.id);
}
