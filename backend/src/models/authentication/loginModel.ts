type LoginModelProps = {
  token: string;
  exp: number;
  createdAt: number;
  name: string;
  email: string;
  id: string;
};

export class LoginModel implements LoginModelProps {
  token: string;
  exp: number;
  createdAt: number;
  name: string;
  email: string;
  id: string;

  constructor({ token, createdAt, exp, name, email, id }: LoginModelProps) {
    this.token = token;
    this.createdAt = createdAt;
    this.exp = exp;
    this.name = name;
    this.email = email;
    this.id = id;
  }
}
