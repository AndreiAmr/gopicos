export type IAuthentication = {
  id: string;
  email: string;
};

export class AuthenticationModel {
  id?: string = undefined;
  email?: string = undefined;

  constructor(props: IAuthentication) {
    console.log('🚀 ~ AuthenticationModel ~ constructor ~ props:', props);
    this.id = props.id;
    this.email = props.email;
  }
}
