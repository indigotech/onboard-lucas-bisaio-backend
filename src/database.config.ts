import { createConnection } from "typeorm";

export class Database {
  static async config(): Promise<void> {
    await createConnection({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "root",
      password: "admin",
      database: "ondoard",
      entities: [__dirname + "/entity/*.ts"],
      synchronize: true,
    });
  }
}
