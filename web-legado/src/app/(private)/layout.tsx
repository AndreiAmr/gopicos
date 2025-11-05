'use client';
import { HomeSidebar } from '@/atomic/organisms/HomeSidebar';

import { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="bg-sidebar-background overflow-hidden w-[100%] h-dvh flex grow flex-row ">
      <div>
        <HomeSidebar />
      </div>
      <main className="h-[100%] w-full flex flex-grow flex-col  ">
        <div className="flex h-20 justify-between ">
          {/* <motion.div
            animate={{
              scale: 1,
            }}
            initial={{
              scale: 0,
            }}
          >
            <SidebarTrigger />
          </motion.div> */}
          <p>salve</p>
        </div>
        <div className="bg-background h-full">{children}</div>
      </main>
    </div>
  );
}
