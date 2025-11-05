import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarMenuButton } from '@/components/ui/sidebar';

export const AppName = () => {
  return (
    <SidebarMenuButton size="lg">
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src={'/logo.svg'} className="object-contain" />
        <AvatarFallback>Skateboarder</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <h2 className="font-title font-bold">GoPicos</h2>
        <p className="font-title ">Skageboard</p>
      </div>
    </SidebarMenuButton>
  );
};
