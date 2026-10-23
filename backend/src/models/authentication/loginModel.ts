type LoginModelProps = {
  token: string;
  exp: number;
  createdAt: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  id: string;
};

export class LoginModel implements LoginModelProps {
  token: string;
  exp: number;
  createdAt: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  id: string;

  constructor({ token, createdAt, exp, name, firstName, lastName, email, id }: LoginModelProps) {
    this.token = token;
    this.createdAt = createdAt;
    this.exp = exp;
    this.name = name;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.id = id;
  }
}
