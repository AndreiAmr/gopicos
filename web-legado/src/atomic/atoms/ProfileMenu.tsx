import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { redirect, RedirectType } from 'next/navigation';
import { ChevronsUpDown, LogOut, Moon, Sun, User } from 'lucide-react';
import { useTheme } from 'next-themes';

type ProfileSidebarProps = {
  imgSrc: string;
  // fallbackText: string;
  name: string;
};
export const ProfileSidebar = ({
  imgSrc,

  name,
}: ProfileSidebarProps) => {
  const { setTheme, theme } = useTheme();

  const handleSignout = async () => {
    window.cookieStore.delete('token');

    redirect('/login', RedirectType.replace);
  };

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    }

    if (theme === 'light') {
      setTheme('dark');
    }
  };

  return (
    <Menubar className="border-none p-0 bg-transparent h-18">
      <MenubarMenu>
        <MenubarTrigger className="" asChild>
          <SidebarMenuButton className="border-none cursor-pointer" size="lg">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={imgSrc}
                className="object-contain rounded-full"
              />
              <AvatarFallback>AA</AvatarFallback>
            </Avatar>

            <div className="flex flex-col flex-grow">
              <h3 className=" font-title font-bold">{name}</h3>
              <p className=" font-title text-muted-foreground text-xs">
                Ver opções
              </p>
            </div>

            <ChevronsUpDown className="text-muted-foreground" />
          </SidebarMenuButton>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <User />
            Ver meu perfil
          </MenubarItem>
          <MenubarItem onClick={toggleTheme}>
            {theme === 'dark' ? <Moon /> : <Sun />}
            Mudar tema
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={handleSignout}>
            <LogOut className="text-red-400" />
            <p className="text-red-400">Sair</p>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
