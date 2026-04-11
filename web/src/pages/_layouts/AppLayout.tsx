import { PlaceSearchValues } from '@/@types/placeSerach';
import { AppSidebar } from '@/atomic/molecules/sidebar';
import { Header } from '@/components/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { NavigationSetter } from '@/NavigationSetter';
import { AuthGuard } from '@/routes/AuthGuard';
import { FormProvider, useForm } from 'react-hook-form';
import { Outlet } from 'react-router';

const defaultValues: PlaceSearchValues = {
  value: '',
  currentPlace: null,
};

export const AppLayout = () => {
  const formMethods = useForm<PlaceSearchValues>({
    defaultValues,
  });

  return (
    <AuthGuard>
      <FormProvider {...formMethods}>
        <NavigationSetter />
        <SidebarProvider defaultOpen className="h-full">
          <AppSidebar />
          <div className="w-full h-full flex flex-col">
            <Header />
            <div className="flex flex-col h-full flex-1 overflow-y-scroll">
              <SidebarInset className="flex-1">
                <Outlet />
              </SidebarInset>
            </div>
          </div>
        </SidebarProvider>
      </FormProvider>
    </AuthGuard>
  );
};
