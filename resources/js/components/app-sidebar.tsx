import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { usePanelView } from '@/contexts/panel-view-context';
import AppLogoDropdown from './app-logo-dropdown';

// Navigation items are now managed by the dashboard view context

export function AppSidebar() {
    const { currentView } = usePanelView();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <div>
                                <AppLogoDropdown />
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={currentView.mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {currentView.footerNavItems && (
                    <NavFooter items={currentView.footerNavItems} className="mt-auto" />
                )}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
