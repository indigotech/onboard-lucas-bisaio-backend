import { getRepository } from "typeorm";
import { setup } from "./server";
import { User } from "./entity";

async function populateDatabase() {
  await setup();
  for (let i = 1; i <= 50; i++) {
    const fakeUser = new User();
    fakeUser.name = `fake user${i}`;
    fakeUser.email = `fake.user${i}@taqtile.com.br`;
    fakeUser.password = "1234qwer";
    fakeUser.birthDate = "01-01-2000";

    await getRepository(User).save(fakeUser);
  }
}

populateDatabase().then(() => {
  console.log("Database was populated with 50 fake users");
  process.exit(0);
});
