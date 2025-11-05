import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { SidebarItems } from './sidebarItems';
import { AppName } from '@/components/header/AppName';

export function AppSidebar() {
  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="bg-sidebar-background "
    >
      <SidebarHeader className="pt-5">
        <AppName />

        <SidebarMenu>
          <SidebarMenuItem className="p-0"></SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarItems />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
