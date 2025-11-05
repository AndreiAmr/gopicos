import { PropsWithChildren } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Picos skateboard',
};

export default function Layout({ children }: PropsWithChildren) {
  return <div className="w-screen h-screen flex flex-row">{children}</div>;
}
