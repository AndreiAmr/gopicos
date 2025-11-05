'use client';
import { useEffect } from 'react';

export const UNAUTHORIZED_MODAL_EVENT = 'OPEN_AUTH_MODAL';

export function triggerAuthModal() {
  window.dispatchEvent(new Event(UNAUTHORIZED_MODAL_EVENT));
}

type Props = {
  openModal(): void;
};

export const useAuthenticationListener = ({ openModal }: Props) => {
  useEffect(() => {
    const handler = () => openModal();
    window.addEventListener(UNAUTHORIZED_MODAL_EVENT, handler);
    return () => window.removeEventListener(UNAUTHORIZED_MODAL_EVENT, handler);
  }, [openModal]);
};
