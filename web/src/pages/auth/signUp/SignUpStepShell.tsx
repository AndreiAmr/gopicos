import { useEffect, useRef } from 'react';
import { ArrowLeftIcon } from 'lucide-react';
import { Link, Navigate } from 'react-router';
import { useSelector } from 'react-redux';

import { Button } from '@/atomic/atoms/button';
import { Stepper } from '@/atomic/molecules/stepper';
import { URL } from '@/routes/url';
import {
  arePreviousStepsValid,
} from '@/store/authentication/signUp/signUpSchemas';
import { signUpSelectors } from '@/store/authentication/signUp/signUpSelectors';
import type { SignUpStep } from '@/store/authentication/signUp/signUpTypes';

const TOTAL_STEPS = 3;

type SignUpStepShellProps = {
  step: SignUpStep;
  subtitle: string;
  onBack?: () => void;
  isLoading?: boolean;
  /** Foco inicial no h2 (passos 2 e 3), quando nenhum campo assume o foco. */
  focusHeading?: boolean;
  children: React.ReactNode;
};

/** Casca comum dos 3 passos: voltar, titulo, stepper e subtitulo. */
export const SignUpStepShell = ({
  step,
  subtitle,
  onBack,
  isLoading = false,
  focusHeading = false,
  children,
}: SignUpStepShellProps) => {
  const values = useSelector(signUpSelectors.getSignUpValues);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (focusHeading) headingRef.current?.focus();
  }, [focusHeading]);

  // Acesso direto a um passo sem os anteriores validos volta ao passo 1.
  if (!arePreviousStepsValid(step, values)) {
    return <Navigate to={URL.SIGN_UP} replace />;
  }

  return (
    <div className="relative flex min-h-dvh w-full justify-center overflow-hidden bg-gp-bg px-8 py-12">
      <span
        aria-hidden="true"
        className="absolute -left-8 top-6 -rotate-6 bg-gp-primary-soft px-10 py-1 text-caption font-bold uppercase tracking-widest text-gp-primary-text"
      >
        Go skate
      </span>

      <div className="mt-12 flex w-full max-w-[400px] flex-col gap-6">
        {onBack && (
          <Button
            type="button"
            variant="link"
            size="sm"
            className="self-start px-0"
            onClick={onBack}
            disabled={isLoading}
          >
            <ArrowLeftIcon aria-hidden="true" />
            Voltar
          </Button>
        )}

        <h1 className="text-display font-bold text-gp-text">Criar conta</h1>

        <Stepper current={step} total={TOTAL_STEPS} />

        <h2
          ref={headingRef}
          tabIndex={-1}
          className="text-h2 font-semibold text-gp-text outline-none"
        >
          {subtitle}
        </h2>
        <p role="status" className="sr-only">
          Passo {step} de {TOTAL_STEPS}: {subtitle}
        </p>

        {children}

        {step === 1 && (
          <p className="text-center text-body-sm text-gp-text-muted">
            Já tem conta?{' '}
            <Link
              to={URL.LOGIN}
              className="font-semibold text-gp-primary-text underline-offset-4 hover:underline"
            >
              Entrar
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};
