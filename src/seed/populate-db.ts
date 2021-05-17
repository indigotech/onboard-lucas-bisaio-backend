import { getRepository } from "typeorm";
import { CryptoService } from "../core/security/crypto";
import { User, Address } from "../entity";

export async function populateDatabase() {
  for (let i = 1; i <= 50; i++) {
    const fakeAddress: Address[] = [await createAddressAndSave(1, i), await createAddressAndSave(2, i)];

    const fakeUser = new User();
    fakeUser.name = `fake user${i}`;
    fakeUser.email = `fake.user${i}@taqtile.com.br`;
    fakeUser.password = CryptoService.encode("1234qwer");
    fakeUser.birthDate = "01-01-2000";
    fakeUser.address = fakeAddress;

    await getRepository(User).save(fakeUser);
  }
}

async function createAddressAndSave(label: number, int: number): Promise<Address> {
  const fakeAddress = new Address();
  fakeAddress.state = `state${label}_` + int;
  fakeAddress.city = `city${label}_` + int;
  fakeAddress.neighborhood = `neighborhood${label}_` + int;
  fakeAddress.street = `street${label}_` + int;
  fakeAddress.number = +`${label}${int}`;

  return getRepository(Address).save(fakeAddress);
}
