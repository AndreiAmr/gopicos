'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import '../lib/mixpanel';
import { ApolloProvider } from '@apollo/client';
import { client } from '@/lib/apollo-client';

import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { ToastContainer } from 'react-toastify';
import { useState } from 'react';
import { useAuthenticationListener } from '@/hooks/useAuthenticationListener';
import { UnauthorizedModal } from '@/components/modals/UnauthorizedModal';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpenUnauthorizedModal, setIsOpenUnauthorizedModal] =
    useState<boolean>(false);

  useAuthenticationListener({
    openModal: () => setIsOpenUnauthorizedModal(true),
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={true}>
            <ApolloProvider client={client}>
              {children}
              <UnauthorizedModal
                isOpen={isOpenUnauthorizedModal}
                onClose={() => setIsOpenUnauthorizedModal(false)}
              />
            </ApolloProvider>
            <ToastContainer />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
