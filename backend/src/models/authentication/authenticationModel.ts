export type IAuthentication = {
  id: string;
  email: string;
};

export class AuthenticationModel {
  readonly id: string;
  readonly email: string;

  constructor(props: IAuthentication) {
    this.id = props.id;
    this.email = props.email;
  }
}
