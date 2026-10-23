import { useEffect } from 'react';
import { Link } from 'react-router';
import { AlertCircleIcon, CheckCircle2Icon, EyeIcon, EyeOffIcon } from 'lucide-react';

import { Button } from '@/atomic/atoms/button';
import { Input } from '@/atomic/atoms/input';
import { SIGN_IN_ERROR_MESSAGES } from '@/store/authentication/signIn/signInErrors';

import { useLogin } from './useLogin';

const SIGNUP_PATH = '/cadastro';

export const LoginPage = () => {
  const {
    isLoading,
    error,
    accountCreated,
    email,
    password,
    showPassword,
    fieldErrors,
    emailRef,
    passwordRef,
    handleSubmit,
    handleEmailChange,
    handlePasswordChange,
    toggleShowPassword,
    retry,
    focusPasswordOnInvalid,
  } = useLogin();

  useEffect(() => {
    if (error === 'invalid_credentials') focusPasswordOnInvalid();
  }, [error, focusPasswordOnInvalid]);

  return (
    <main className="flex min-h-full w-full flex-1 items-center justify-center bg-gp-bg px-4 py-8">
      <div className="flex w-full max-w-[400px] flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="sr-only">Entrar</h1>
          <div className="flex items-center gap-2">
            <img src="/logo-gopicos.svg" alt="" aria-hidden="true" />
            <span className="font-display text-3xl text-gp-text">GoPicos</span>
          </div>
          <p className="text-body-sm text-gp-text-muted">
            Localize o pico perfeito para andar de skate
          </p>
        </header>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <Input
            ref={emailRef}
            label="E-mail"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            autoFocus
            placeholder="voce@exemplo.com"
            value={email}
            readOnly={isLoading}
            error={fieldErrors.email}
            onChange={(e) => handleEmailChange(e.target.value)}
          />

          <div className="relative">
            <Input
              ref={passwordRef}
              label="Senha"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              readOnly={isLoading}
              error={fieldErrors.password}
              className="pr-12"
              onChange={(e) => handlePasswordChange(e.target.value)}
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              aria-pressed={showPassword}
              className="absolute right-0 top-[26px] flex size-12 items-center justify-center rounded-md text-gp-text-muted focus-visible:ring-2 focus-visible:ring-gp-focus focus-visible:outline-none"
            >
              {showPassword ? (
                <EyeOffIcon className="size-5" aria-hidden="true" />
              ) : (
                <EyeIcon className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>

          {accountCreated && !error && (
            <div
              role="status"
              className="flex items-start gap-2 rounded-md border-[1.5px] border-l-4 border-gp-success bg-gp-sunken p-3 text-body-sm text-gp-text"
            >
              <CheckCircle2Icon
                className="mt-0.5 size-5 shrink-0 text-gp-success"
                aria-hidden="true"
              />
              <span>Conta criada! Entre com seu e-mail e senha.</span>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-md border-[1.5px] border-l-4 border-gp-error bg-gp-sunken p-3 text-body-sm text-gp-text"
            >
              <AlertCircleIcon
                className="mt-0.5 size-5 shrink-0 text-gp-error"
                aria-hidden="true"
              />
              <div className="flex flex-col items-start gap-1">
                <span>{SIGN_IN_ERROR_MESSAGES[error]}</span>
                {error !== 'invalid_credentials' && (
                  <button
                    type="button"
                    onClick={retry}
                    className="text-label font-semibold text-gp-primary-text underline"
                  >
                    Tentar novamente
                  </button>
                )}
              </div>
            </div>
          )}

          <Button type="submit" size="lg" className="w-full" loading={isLoading}>
            Entrar
          </Button>
          <span className="sr-only" role="status">
            {isLoading ? 'Entrando' : ''}
          </span>
        </form>

        <div className="flex flex-col gap-2 border-t border-gp-divider pt-6 text-body-sm text-gp-text-muted">
          <span>Não tem conta?</span>
          <Link
            to={SIGNUP_PATH}
            aria-disabled={isLoading || undefined}
            className="w-fit py-2 font-semibold text-gp-primary-text underline hover:text-gp-primary-hover"
          >
            Cadastre-se
          </Link>
        </div>
      </div>
    </main>
  );
};
