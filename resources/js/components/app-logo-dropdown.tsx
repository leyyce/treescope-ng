import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import AppLogo from './app-logo';
import { usePanelView } from '@/contexts/panel-view-context';
import { router } from '@inertiajs/react';
import { useSidebar } from './ui/sidebar';
import { usePermissions } from '@/hooks/use-permissions';

export default function AppLogoDropdown() {
  const { setCurrentView, accessibleViews, currentView } = usePanelView();
  const { open } = useSidebar();
  const { hasPermissions, hasRoles, hasMixed } = usePermissions();

  const handleViewChange = (viewId: string) => {
    // Only proceed if this is a different view
    if (viewId !== currentView.id) {
      // Find the new view from accessible views
      const newView = accessibleViews.find(view => view.id === viewId);

      if (newView) {
        // Set the current view by ID (the context will handle persistence)
        setCurrentView(viewId);

        // Get the accessible nav items from the new view directly
        const newViewNavItems = newView.mainNavItems.filter(item => {
          // Check if the user has the required permissions for this nav item
          const accessibleByPermission = hasPermissions(item.requiredPermissions);

          // Check if the user has the required roles for this nav item
          const accessibleByRole = hasRoles(item.requiredRoles);

          // Check if the user has the required mixed permissions/roles for this nav item
          const accessibleByMixed = hasMixed(item.requiredMixed);

          // The item is accessible only if all checks pass
          return accessibleByPermission && accessibleByRole && accessibleByMixed;
        });

        // Navigate to the first accessible item in the new view
        if (newViewNavItems.length > 0) {
          router.visit(newViewNavItems[0].href);
        }
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-1 px-0 hover:bg-transparent focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0 focus-visible:shadow-none active:outline-none active:ring-0">
          <AppLogo panelLabel={currentView.label} />
          {open && <ChevronDown className="h-4 w-4 opacity-50" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {accessibleViews.map((view) => (
          <DropdownMenuItem
            key={view.id}
            className="cursor-pointer"
            onClick={() => handleViewChange(view.id)}
          >
            {view.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
