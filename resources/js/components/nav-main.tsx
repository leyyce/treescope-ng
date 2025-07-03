import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { usePermissions } from '@/hooks/use-permissions';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const { hasPermission, hasRole } = usePermissions();

    // Filter items based on permissions and roles
    const filteredItems = items.filter(item => {
        // If the item doesn't have any permission or role requirements, it's accessible to everyone
        if (!item.requiredPermissions && !item.requiredRoles) {
            return true;
        }

        // Check if the user has any of the required permissions
        if (item.requiredPermissions && item.requiredPermissions.length > 0) {
            const hasRequiredPermission = item.requiredPermissions.some(permission =>
                hasPermission(permission)
            );
            if (hasRequiredPermission) {
                return true;
            }
        }

        // Check if the user has any of the required roles
        if (item.requiredRoles && item.requiredRoles.length > 0) {
            const hasRequiredRole = item.requiredRoles.some(role =>
                hasRole(role)
            );
            if (hasRequiredRole) {
                return true;
            }
        }

        // If the item has requirements but the user doesn't meet any of them, it's not accessible
        return false;
    });

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {filteredItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }}>
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
