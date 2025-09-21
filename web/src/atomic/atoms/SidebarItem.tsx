import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import {
  ChevronRight,
  List,
  LucideIcon,
  Search,
  Plus,
  User,
} from 'lucide-react';
import mixpanel from 'mixpanel-browser/src/loaders/loader-module-core';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

type NavItemProps = {
  title: string;
  tooltip: string;
  icon: LucideIcon;
  linkTo?: string;
};

type NavGroupProps = {
  groupLabel: string;
  items: NavItemProps[];
};

const items: NavGroupProps[] = [
  {
    groupLabel: 'Mapa',
    items: [
      { title: 'Pesquisar pico', tooltip: 'Pesquisar pico', icon: Search },
      { title: 'Lista de picos', tooltip: 'Lista de picos', icon: List },
      {
        title: 'Cadastrar novo pico',
        tooltip: 'Cadastrar novo pico',
        icon: Plus,
        linkTo: '/spot/new-spot',
      },
    ],
  },
  {
    groupLabel: 'Perfil',
    items: [
      {
        title: 'Ver meu perfil',
        icon: User,
        tooltip: 'Ver meu perfil tooltip',
      },
    ],
  },
];

export const SidebarItem = () => {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      <SidebarGroup>
        {items.map((item) => (
          <SidebarMenu key={item.groupLabel} className="mt-6">
            <SidebarGroupLabel>{item.groupLabel}</SidebarGroupLabel>

            {item.items.map((page) => (
              <Link href={page.linkTo || '/home'} key={page.title}>
                <SidebarMenuItem className="">
                  <SidebarMenuButton
                    tooltip={page.tooltip}
                    className={cn(
                      'cursor-pointer transition-all',
                      pathname.includes(page.linkTo!) &&
                        'bg-primary/10 text-primary'
                    )}
                  >
                    {page.icon && <page.icon />}
                    <span className="ml-5 text-title ">{page.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Link>
            ))}
          </SidebarMenu>
        ))}
      </SidebarGroup>
    </SidebarMenu>
  );
};
