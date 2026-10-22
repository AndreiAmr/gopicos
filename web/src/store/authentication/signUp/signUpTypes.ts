export enum SignUpActionTypes {
  SUBMIT_SIGN_UP_ASYNC = '@signUp/signUp/SUBMIT_SIGN_UP_ASYNC',
  SAVE_SIGN_UP_VALUES = '@signUp/signUp/SAVE_SIGN_UP_VALUES',
  SET_IS_LOADING_SIGN_UP = '@signUp/signUp/SET_IS_LOADING_SIGN_UP',
  SET_SIGN_UP_FIELD_ERROR = '@signUp/signUp/SET_SIGN_UP_FIELD_ERROR',
  SET_SIGN_UP_BANNER_ERROR = '@signUp/signUp/SET_SIGN_UP_BANNER_ERROR',
  RESET_SIGN_UP = '@signUp/signUp/RESET_SIGN_UP',
}

export type SignUpStep = 1 | 2 | 3;

export type SignUpField =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'emailConfirm'
  | 'password'
  | 'passwordConfirm';

/** Dados do cadastro em memoria (nunca persistidos; a senha sai no sucesso). */
export interface ISignUpValues {
  firstName: string;
  lastName: string;
  email: string;
  emailConfirm: string;
  password: string;
  passwordConfirm: string;
}

/** Erro do servidor ligado a um campo (fonte de verdade da mensagem). */
export interface ISignUpFieldError {
  field: SignUpField;
  message: string;
  /** Tipo do erro, ex.: EMAIL_ALREADY_EXISTS (habilita o link "Entrar"). */
  type?: string;
}

export interface ISignUpModule {
  values: ISignUpValues;
  isLoading: boolean;
  fieldError: ISignUpFieldError | null;
  bannerError: string | null;
  /** Quando o erro de rede permite "Tentar novamente". */
  canRetry: boolean;
}

export interface ISignUpState {
  signUp: ISignUpModule;
}

export interface ISignUpPayload {
  values?: Partial<ISignUpValues>;
  isLoading?: boolean;
  fieldError?: ISignUpFieldError | null;
  bannerError?: string | null;
  canRetry?: boolean;
}

export type ISignUpAction = {
  type: SignUpActionTypes;
  payload?: ISignUpPayload;
};

export type ISignUpReducer = (
  state: ISignUpState,
  payload?: ISignUpPayload
) => ISignUpState;
