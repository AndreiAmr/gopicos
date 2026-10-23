import { User } from '@prisma/client';

export class LoginDTO implements User {
  email: string;
  id: string;
  firstName: string;
  lastName: string;
  password: string;
  deactivatedAt: Date | null;
  createdAt: Date;

  constructor(props: User) {
    this.email = props.email;
    this.id = props.id;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.password = props.password;
    this.deactivatedAt = props.deactivatedAt;
    this.createdAt = props.createdAt;
  }
}
