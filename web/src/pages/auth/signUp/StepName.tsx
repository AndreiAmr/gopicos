import { Button } from '@/atomic/atoms/button';
import { Input } from '@/atomic/atoms/input';

import { SignUpStepShell } from './SignUpStepShell';
import { useSignUpStep } from './useSignUpStep';

export const StepName = () => {
  const { field, goNext, isLoading } = useSignUpStep(1, [
    'firstName',
    'lastName',
  ]);

  return (
    <SignUpStepShell step={1} subtitle="Seus dados">
      <form onSubmit={goNext} noValidate className="flex flex-col gap-4">
        <Input
          label="Nome"
          placeholder="Marina"
          autoComplete="given-name"
          autoCapitalize="words"
          maxLength={40}
          autoFocus
          {...field('firstName')}
        />
        <Input
          label="Sobrenome"
          placeholder="Souza"
          autoComplete="family-name"
          autoCapitalize="words"
          maxLength={40}
          {...field('lastName')}
        />
        <Button type="submit" size="lg" className="w-full" loading={isLoading}>
          Continuar
        </Button>
      </form>
    </SignUpStepShell>
  );
};
