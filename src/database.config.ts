import { Connection, createConnection } from "typeorm";

export async function configDatabase(): Promise<Connection> {
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
  return connection;
}
