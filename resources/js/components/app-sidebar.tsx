import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { usePanelView } from '@/contexts/panel-view-context';
import AppLogoDropdown from './app-logo-dropdown';
import AppLogo from '@/components/app-logo';

// Navigation items are now managed by the dashboard view context

export function AppSidebar() {
    const { accessibleViews, accessibleMainNavItems, accessibleFooterNavItems } = usePanelView();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <div>
                                {accessibleViews.length === 1 ? <AppLogo /> : <AppLogoDropdown />}
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={accessibleMainNavItems}/>
            </SidebarContent>

            <SidebarFooter>
                {accessibleFooterNavItems && (
                    <NavFooter items={accessibleFooterNavItems} className="mt-auto" />
                )}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
