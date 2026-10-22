import { LockIcon } from 'lucide-react';
import { useOutletContext } from 'react-router';

import { AlertBanner } from '@/atomic/molecules/alertBanner';
import { EmptyState } from '@/atomic/molecules/emptyState';
import { Button } from '@/atomic/atoms/button';
import { Input } from '@/atomic/atoms/input';
import { Skeleton } from '@/atomic/atoms/skeleton';

import type { ProfileOutletContext } from '@/pages/_layouts/ProfileLayout';

import { ProfileAvatar } from './ProfileAvatar';
import { DELETE_STRINGS, PROFILE_STRINGS, fullName, memberSince } from './profileLogic';
import { useMyData } from './useMyData';

/** "Meus dados": cabeçalho do perfil + formulário de edição (P1 + P2). */
export const MyDataPage = () => {
  const s = useMyData();
  const { openDeleteAccount } = useOutletContext<ProfileOutletContext>();

  if (s.isLoading) {
    return (
      <div className="flex flex-col gap-6" aria-busy="true" data-testid="profile-skeleton">
        <div className="flex items-center gap-4">
          <Skeleton className="size-24 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-5 w-56" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
        <Skeleton className="h-12 w-full max-w-[400px]" />
        <Skeleton className="h-12 w-full max-w-[400px]" />
        <Skeleton className="h-12 w-full max-w-[400px]" />
      </div>
    );
  }

  if (s.loadError || !s.me) {
    return (
      <EmptyState
        variant="error"
        title={PROFILE_STRINGS.loadError}
        actionLabel={PROFILE_STRINGS.retry}
        onAction={s.retryLoad}
      />
    );
  }

  const name = fullName(s.me.firstName, s.me.lastName);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex items-center gap-4" aria-label="Resumo do perfil">
        <ProfileAvatar firstName={s.me.firstName} lastName={s.me.lastName} />
        <div className="flex min-w-0 flex-col gap-1">
          <h1 tabIndex={-1} title={name} className="line-clamp-2 text-h1 text-gp-text">
            {PROFILE_STRINGS.myData}
          </h1>
          <p className="line-clamp-2 text-body-strong text-gp-text">{name}</p>
          <p className="truncate text-body text-gp-text-muted">{s.me.email}</p>
          <p className="text-caption text-gp-text-muted">{memberSince(s.me.createdAt)}</p>
        </div>
      </section>

      <form
        className="flex max-w-[400px] flex-col gap-4"
        onSubmit={s.handleSubmit}
        noValidate
      >
        <Input
          ref={s.firstNameRef}
          label={PROFILE_STRINGS.firstName}
          name="firstName"
          autoComplete="given-name"
          autoCapitalize="words"
          maxLength={40}
          value={s.firstName}
          readOnly={s.isSaving}
          error={s.firstNameError}
          onChange={(e) => s.changeFirstName(e.target.value)}
        />
        <Input
          ref={s.lastNameRef}
          label={PROFILE_STRINGS.lastName}
          name="lastName"
          autoComplete="family-name"
          autoCapitalize="words"
          maxLength={40}
          value={s.lastName}
          readOnly={s.isSaving}
          error={s.lastNameError}
          onChange={(e) => s.changeLastName(e.target.value)}
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="profile-email" className="text-body-sm font-semibold text-gp-text">
            {PROFILE_STRINGS.email}
          </label>
          <div className="relative">
            <input
              id="profile-email"
              value={s.me.email}
              readOnly
              aria-readonly="true"
              aria-describedby="profile-email-hint"
              className="h-12 w-full rounded-md bg-gp-sunken px-3 pr-10 text-body text-gp-text-muted outline-none focus-visible:ring-2 focus-visible:ring-gp-focus"
            />
            <LockIcon
              className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gp-text-muted"
              aria-hidden="true"
            />
          </div>
          <p id="profile-email-hint" className="text-body-sm text-gp-text-muted">
            {PROFILE_STRINGS.emailHint}
          </p>
        </div>

        {s.banner && (
          <AlertBanner
            variant="error"
            action={{ label: PROFILE_STRINGS.retry, onClick: s.retrySave }}
          >
            {s.banner}
          </AlertBanner>
        )}

        <Button
          type="submit"
          size="lg"
          className="min-w-40 self-start"
          loading={s.isSaving}
          disabled={!s.canSave && !s.isSaving}
        >
          {PROFILE_STRINGS.save}
        </Button>
        <span className="sr-only" role="status">
          {s.isSaving ? 'Salvando' : ''}
        </span>
      </form>

      <section
        aria-labelledby="danger-zone-title"
        className="flex max-w-[400px] flex-col gap-3 rounded-lg border-[1.5px] border-gp-error p-4"
      >
        <h2 id="danger-zone-title" className="text-h3 text-gp-error">
          {DELETE_STRINGS.title}
        </h2>
        <p className="text-body text-gp-text">{DELETE_STRINGS.dangerText}</p>
        <Button type="button" variant="destructive" className="self-start" onClick={openDeleteAccount}>
          {DELETE_STRINGS.submit}
        </Button>
      </section>
    </div>
  );
};
