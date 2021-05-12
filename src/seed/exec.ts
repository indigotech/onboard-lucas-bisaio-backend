import { setup } from "../server";
import { populateDatabase } from "./populate-db";

setup().then(() => {
  populateDatabase().then(() => {
    console.log("Database was populated with 50 fake users");
    process.exit(0);
  });
});
