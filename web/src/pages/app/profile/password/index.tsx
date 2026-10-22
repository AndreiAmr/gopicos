import { AlertBanner } from '@/atomic/molecules/alertBanner';
import { Button } from '@/atomic/atoms/button';
import { PasswordInput } from '@/atomic/atoms/passwordInput';

import { PASSWORD_STRINGS } from './passwordLogic';
import { useChangePassword } from './useChangePassword';

export const ChangePasswordPage = () => {
  const s = useChangePassword();

  return (
    <div className="flex max-w-[400px] flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 tabIndex={-1} className="text-h1 text-gp-text">
          {PASSWORD_STRINGS.title}
        </h1>
        <p className="text-body text-gp-text-muted">{PASSWORD_STRINGS.intro}</p>
      </header>

      <form className="flex flex-col gap-4" onSubmit={s.handleSubmit} noValidate>
        <PasswordInput
          ref={s.currentRef}
          label={PASSWORD_STRINGS.current}
          name="currentPassword"
          autoComplete="current-password"
          autoFocus
          value={s.values.currentPassword}
          readOnly={s.isLoading}
          error={s.currentError}
          onChange={(e) => s.changeCurrent(e.target.value)}
        />
        <PasswordInput
          ref={s.newRef}
          label={PASSWORD_STRINGS.next}
          hint={PASSWORD_STRINGS.nextHint}
          name="newPassword"
          autoComplete="new-password"
          value={s.values.newPassword}
          readOnly={s.isLoading}
          error={s.newError}
          onChange={(e) => s.changeNew(e.target.value)}
        />
        <PasswordInput
          ref={s.confirmRef}
          label={PASSWORD_STRINGS.confirm}
          name="confirmPassword"
          autoComplete="new-password"
          value={s.values.confirmPassword}
          readOnly={s.isLoading}
          error={s.confirmError}
          onChange={(e) => s.changeConfirm(e.target.value)}
          onBlur={s.blurConfirm}
        />

        {s.banner && (
          <AlertBanner variant="error" action={{ label: 'Tentar novamente', onClick: s.retry }}>
            {s.banner}
          </AlertBanner>
        )}

        <Button type="submit" size="lg" className="min-w-40 self-start" loading={s.isLoading}>
          {PASSWORD_STRINGS.submit}
        </Button>
        <span className="sr-only" role="status">
          {s.isLoading ? 'Alterando senha' : ''}
        </span>
      </form>
    </div>
  );
};
