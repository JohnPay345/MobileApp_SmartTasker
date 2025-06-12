import { v4 } from "uuid";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

export const UsersConfig = {
  UsersData: new Map(),
  initializeUsers: async () => {
    const fillUsersData = new Map();
    const gender = ['male', 'female'];
    for (let i = 0; i <= 10; i++) {
      let randomGenderIndex = Math.floor(Math.random * 2);
      const user = {
        first_name: faker.person.firstName(gender[randomGenderIndex]),
        middle_name: faker.person.middleName(gender[randomGenderIndex]),
        last_name: faker.person.lastName(gender[randomGenderIndex]),
        email: faker.internet.email(),
        phone_number: faker.phone.number({ style: 'national' }),
        password: await bcrypt.hash(faker.internet.password({ length: 12 }), await bcrypt.genSalt(10)),
        birth_date: faker.date.birthdate(),
        start_date: faker.date.between({ from: new Date("2015-01-01").toISOString(), to: new Date("2025-03-06").toISOString() }),
        gender: gender[randomGenderIndex],
        address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.country()}`,
        job_title: faker.person.jobTitle(),
        avatar_path: faker.image.avatar(),
        last_login: faker.date.soon(),
        skills: faker.person.jobArea(),
        created_user_id: '',
        created_at: faker.date.between({ from: new Date("2018-01-01").toISOString(), to: new Date("2025-08-08").toISOString() }),
        updated_at: faker.date.between({ from: new Date("2018-01-01").toISOString(), to: new Date("2025-08-08").toISOString() })
      }
      fillUsersData.set(v4(), user);
    }
    UsersConfig.UsersData = fillUsersData;
  },
  getUsers: async () => {
    return UsersConfig.UsersData;
  },
  setUser: async (data) => {
    return UsersConfig.UsersData.set(v4(), data);;
  }
}