import { Connection, createConnection } from "typeorm";

export class Database {
  static connection: Connection;

  static async configDatabase(): Promise<void> {
    const connection = await createConnection({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "root",
      password: "admin",
      database: "ondoard",
      entities: [__dirname + "/entity/*.ts"],
      synchronize: true,
    });

    this.connection = connection;
  }
}
