import { Connection, createConnection } from "typeorm";

interface DatabaseConfigs {
  port: number;
  username: string;
  password: string;
  database: string;
}

export class Database {
  static async config(param: DatabaseConfigs): Promise<Connection> {
    return createConnection({
      type: "postgres",
      host: "localhost",
      port: param.port,
      username: param.username,
      password: param.password,
      database: param.database,
      entities: [__dirname + "/entity/*.ts"],
      synchronize: true,
    });
  }
}
