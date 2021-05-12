import { getRepository } from "typeorm";
import { User } from "../entity";

export async function populateDatabase() {
  for (let i = 1; i <= 50; i++) {
    const fakeUser = new User();
    fakeUser.name = `fake user${i}`;
    fakeUser.email = `fake.user${i}@taqtile.com.br`;
    fakeUser.password = "1234qwer";
    fakeUser.birthDate = "01-01-2000";

    await getRepository(User).save(fakeUser);
  }
}
