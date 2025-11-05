import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { setNavigate } from './routes/navigation';

export const NavigationSetter = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return null;
};
