import { Outlet } from 'react-router';
import { NavigationSetter } from '../../NavigationSetter';

export const StartLayout = () => {
  return (
    <>
      <NavigationSetter />
      <Outlet />
    </>
  );
};
