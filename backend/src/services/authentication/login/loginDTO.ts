import { User } from '../../../../prisma/generated';

export class LoginDTO implements User {
  email: string;
  id: string;
  name: string;
  password: string;

  constructor(props: User) {
    this.email = props.email;
    this.id = props.id;
    this.name = props.name;
    this.password = props.password;
  }
}
