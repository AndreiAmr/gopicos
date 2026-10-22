import { Button } from '@/atomic/atoms/button';
import { PasswordInput } from '@/atomic/atoms/passwordInput';
import { AlertBanner } from '@/atomic/molecules/alertBanner';
import { PASSWORD_MIN_LENGTH } from '@/store/authentication/signUp/signUpSchemas';

import { SignUpStepShell } from './SignUpStepShell';
import { useSignUpStep } from './useSignUpStep';

export const StepPassword = () => {
  const { field, submit, goBack, isLoading, bannerError, canRetry, serverError } =
    useSignUpStep(3, ['password', 'passwordConfirm']);

  return (
    <SignUpStepShell
      step={3}
      subtitle="Crie sua senha"
      onBack={goBack}
      isLoading={isLoading}
      focusHeading={!serverError}
    >
      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        <PasswordInput
          label="Senha"
          autoComplete="new-password"
          hint={`Mínimo de ${PASSWORD_MIN_LENGTH} caracteres.`}
          {...field('password')}
        />
        <PasswordInput
          label="Confirmar senha"
          autoComplete="new-password"
          {...field('passwordConfirm')}
        />

        {/* GP-099 (#90): o aceite dos termos entra aqui, antes do botao. */}

        {bannerError && (
          <AlertBanner
            variant="error"
            action={
              canRetry ? { label: 'Tentar novamente', onClick: () => submit() } : undefined
            }
          >
            {bannerError}
          </AlertBanner>
        )}

        <Button type="submit" size="lg" className="w-full" loading={isLoading}>
          Criar conta
        </Button>
      </form>
    </SignUpStepShell>
  );
};
