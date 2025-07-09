import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { usePermissions } from '@/hooks/use-permissions';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const { hasPermissions, hasRoles, hasMixed } = usePermissions();

    // Filter items based on permissions and roles
    const filteredItems = items.filter(item => {
        const accessibleByPermission = hasPermissions(item.requiredPermissions);
        const accessibleByRole = hasRoles(item.requiredRoles);
        const accessibleByMix = hasMixed(item.requiredMixed);
        return accessibleByPermission && accessibleByRole && accessibleByMix;
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
