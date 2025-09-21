'use client';
import { Modal } from '@suraj8558/react-custom-modal';
import useUnauthorizedModal from './useUnauthorizedModal';

type UnauthorizedModalProps = {
  isOpen: boolean;
  onClose(): void;
};
export const UnauthorizedModal = ({
  isOpen,
  onClose,
}: UnauthorizedModalProps) => {
  const { count } = useUnauthorizedModal({ isOpen, handleClose: onClose });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h1>Ops...</h1>
      <p>Sua sessão expirou. Logue novamente para continuar navegando.</p>
      <p>Estamos te direcionando para o login em {count} segundos.</p>
    </Modal>
  );
};
