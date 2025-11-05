import { User } from '../../../../prisma/generated';

export class SignupDTO implements User {
  password: string;
  email: string;
  id: string;
  name: string;

  constructor(prop: User) {
    this.password = prop.password;
    this.email = prop.email;
    this.id = prop.id;
    this.name = prop.name;
  }
}
