import { Link } from 'react-router';

import { Button } from '@/atomic/atoms/button';
import { Input } from '@/atomic/atoms/input';
import { URL } from '@/routes/url';
import { EMAIL_ALREADY_EXISTS } from '@/store/authentication/signUp/signUpErrors';

import { SignUpStepShell } from './SignUpStepShell';
import { useSignUpStep } from './useSignUpStep';

const emailProps = {
  type: 'email',
  inputMode: 'email',
  autoCapitalize: 'none',
  autoCorrect: 'off',
  spellCheck: false,
} as const;

export const StepEmail = () => {
  const { field, goNext, goBack, isLoading, serverError, getValues } =
    useSignUpStep(2, ['email', 'emailConfirm']);

  const emailAlreadyExists = serverError?.type === EMAIL_ALREADY_EXISTS;

  return (
    <SignUpStepShell
      step={2}
      subtitle="Seu e-mail"
      onBack={goBack}
      isLoading={isLoading}
      focusHeading={!serverError}
    >
      <form onSubmit={goNext} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Input
            label="E-mail"
            placeholder="voce@exemplo.com"
            autoComplete="email"
            {...emailProps}
            {...field('email')}
          />
          {emailAlreadyExists && (
            <Button asChild variant="link" size="sm" className="self-start px-0">
              <Link
                to={URL.LOGIN}
                state={{ email: getValues('email') }}
                aria-label="Entrar com este e-mail"
              >
                Entrar
              </Link>
            </Button>
          )}
        </div>
        <Input
          label="Confirmar e-mail"
          placeholder="Repita o e-mail"
          autoComplete="off"
          {...emailProps}
          {...field('emailConfirm')}
        />
        <Button type="submit" size="lg" className="w-full" loading={isLoading}>
          Continuar
        </Button>
      </form>
    </SignUpStepShell>
  );
};
