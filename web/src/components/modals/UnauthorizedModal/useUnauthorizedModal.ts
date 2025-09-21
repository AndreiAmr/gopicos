import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type IUseUnauthorizedModalProps = {
  isOpen: boolean;
  handleClose(): void;
};

const useUnauthorizedModal = ({
  isOpen,
  handleClose,
}: IUseUnauthorizedModalProps) => {
  const router = useRouter();
  const [count, setCount] = useState(5);

  useEffect(() => {
    if (count <= 0 || !isOpen) {
      return;
    }

    const interval = setInterval(() => {
      setCount((prev: number) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [count, isOpen]);

  useEffect(() => {
    if (isOpen && count <= 0) {
      handleClose();
      router.replace('/login');
      setCount(5);
    }
  }, [isOpen, count, handleClose, router]);

  return { count };
};

export default useUnauthorizedModal;
