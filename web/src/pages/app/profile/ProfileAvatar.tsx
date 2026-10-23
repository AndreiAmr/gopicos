import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

import { initialsOf } from './profileLogic';

type ProfileAvatarProps = {
  firstName?: string;
  lastName?: string;
  className?: string;
};

/** Avatar do MVP (D30): círculo `primary-soft` com as iniciais; decorativo. */
export const ProfileAvatar = ({
  firstName,
  lastName,
  className,
}: ProfileAvatarProps) => (
  <Avatar aria-hidden="true" className={cn('size-24 border-[1.5px] border-gp-border', className)}>
    <AvatarFallback className="bg-gp-primary-soft text-h2 font-semibold text-gp-primary-text">
      {initialsOf(firstName, lastName)}
    </AvatarFallback>
  </Avatar>
);
