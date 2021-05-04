import { Connection, createConnection } from 'typeorm';

export async function configDatabase(): Promise<Connection> {
  const connection = await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "root",
    password: "admin",
    database: "postgre",
    entities: [
        __dirname + "/entity/*.js"
    ],
    synchronize: true,
  })
  return connection;
}