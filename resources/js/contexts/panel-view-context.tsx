import { usePermissions } from '@/hooks/use-permissions';
import { NavItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Shield, Trees, Users, ScrollText } from 'lucide-react';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { checkMixed, checkPermissions, checkRoles } from '@/lib/permissions';

// Define the available panel views
export type PanelViewType = 'user' | 'expert' | 'admin';

// Define the structure for each panel view
export interface PanelView {
    id: PanelViewType;
    label: string;
    mainNavItems: NavItem[];
    footerNavItems?: NavItem[];
    // Optional URL patterns that this view can handle
    urlPatterns?: string[];
    // Optional permissions required to access this view
    requiredPermissions?: string | string[];
    // Optional roles required to access this view
    requiredRoles?: string | string[];
    // Optional mix of permissions and roles required to access this view
    requiredMixed?: string | string[];
}

// Define the panel views
export const panelViews: PanelView[] = [
    {
        id: 'user',
        label: 'User Panel',
        mainNavItems: [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: LayoutGrid,
                requiredPermissions: 'view user dashboard',
            },
            {
                title: 'Tree Map',
                href: '/tree-map',
                icon: Trees,
                requiredPermissions: 'view tree map',
            },
        ],
        footerNavItems: [
            {
                title: 'Repository',
                href: 'https://github.com/leyyce/treescope-ng/',
                icon: Folder,
            },
            {
                title: 'Documentation',
                href: 'https://laravel.com/docs/starter-kits#react',
                icon: BookOpen,
            },
        ],
        requiredPermissions: 'access user panel',
    },
    {
        id: 'expert',
        label: 'Expert Panel',
        mainNavItems: [
            {
                title: 'Expert Dashboard',
                href: '/expert/dashboard',
                icon: LayoutGrid,
                requiredPermissions: 'view expert dashboard',
            },
            {
                title: 'Tree Species',
                href: '/expert/tree-species',
                icon: Trees,
                requiredPermissions: 'view tree species',
            },
        ],
        footerNavItems: [
            {
                title: 'Repository',
                href: 'https://github.com/leyyce/treescope-ng/',
                icon: Folder,
            },
            {
                title: 'Documentation',
                href: 'https://laravel.com/docs/starter-kits#react',
                icon: BookOpen,
            },
        ],
        urlPatterns: ['/expert/*'],
        requiredPermissions: 'access expert panel',
    },
    {
        id: 'admin',
        label: 'Admin Panel',
        mainNavItems: [
            {
                title: 'Admin Dashboard',
                href: '/admin/dashboard',
                icon: LayoutGrid,
                requiredPermissions: 'view admin dashboard',
            },
            {
                title: 'User Management',
                href: '/admin/users',
                icon: Users,
                requiredPermissions: 'view users',
            },
            {
                title: 'Role Management',
                href: '/admin/roles',
                icon: Shield,
                requiredPermissions: 'view roles',
            },
            {
                title: 'Permission Management',
                href: '/admin/permissions',
                icon: ScrollText,
                requiredPermissions: 'view permissions',
            }
        ],
        footerNavItems: [
            {
                title: 'Repository',
                href: 'https://github.com/leyyce/treescope-ng/',
                icon: Folder,
            },
            {
                title: 'Documentation',
                href: 'https://laravel.com/docs/starter-kits#react',
                icon: BookOpen,
            },
        ],
        urlPatterns: ['/admin/*'],
        requiredPermissions: 'access admin panel',
    },
];

// Create a registry for panel views
class ViewRegistry {
    private views: Map<string, PanelView> = new Map();

    constructor(initialViews: PanelView[] = []) {
        initialViews.forEach((view) => this.register(view));
    }

    register(view: PanelView): void {
        this.views.set(view.id, view);
    }

    unregister(viewId: string): void {
        this.views.delete(viewId);
    }

    getView(viewId: string): PanelView | undefined {
        return this.views.get(viewId);
    }

    getAllViews(): PanelView[] {
        return Array.from(this.views.values());
    }

    // Get all views that the user has permission to access
    getAccessibleViews(userPermissions: string[], userRoles: string[]): PanelView[] {
        return Array.from(this.views.values()).filter((view: PanelView) => {
            const accessibleByPermission = checkPermissions(
                view.requiredPermissions,
                userPermissions
            );

            const accessibleByRole = checkRoles(
                view.requiredRoles,
                userRoles
            );

            const accessibleByMixed = checkMixed(
                view.requiredMixed,
                userPermissions,
                userRoles
            )

            // The view is accessible only if both permission and role checks pass.
            return accessibleByPermission && accessibleByRole && accessibleByMixed;
        });

    }

    findViewForUrl(url: string): PanelView | undefined {
        for (const view of this.views.values()) {
            if (
                view.urlPatterns &&
                view.urlPatterns.some((pattern) => {
                    // Simple pattern matching - could be enhanced with regex
                    if (pattern.endsWith('*')) {
                        const prefix = pattern.slice(0, -1);
                        return url.startsWith(prefix);
                    }
                    return url === pattern || url.startsWith(`${pattern}/`);
                })
            ) {
                return view;
            }
        }
        return undefined;
    }
}

// Create the context interface
interface PanelViewContextType {
    currentView: PanelView;
    setCurrentView: (viewId: string) => void;
    availableViews: PanelView[];
    accessibleViews: PanelView[];
    accessibleMainNavItems: NavItem[];
    accessibleFooterNavItems: NavItem[] | undefined;
    registerView: (view: PanelView) => void;
    unregisterView: (viewId: string) => void;
}

// Create the context with a default value
const PanelViewContext = createContext<PanelViewContextType | undefined>(undefined);

// Create a provider component
interface PanelViewProviderProps {
    children: ReactNode;
}

export function PanelViewProvider({ children }: PanelViewProviderProps) {
    const page = usePage();
    const { permissions, roles } = usePermissions();
    const [registry] = useState(() => new ViewRegistry(panelViews));
    const [currentView, setCurrentViewState] = useState<PanelView>(() => {
        return panelViews[0];
    });

    // Set current view
    const setCurrentView = useCallback(
        (viewId: string) => {
            const view = registry.getView(viewId);
            if (view) {
                setCurrentViewState(view);
            }
        },
        [registry],
    );

    // Register a new view
    const registerView = useCallback(
        (view: PanelView) => {
            registry.register(view);
        },
        [registry],
    );

    // Unregister a view
    const unregisterView = useCallback(
        (viewId: string) => {
            registry.unregister(viewId);
        },
        [registry],
    );

    const accessibleMainNavItems = useMemo((): NavItem[] => {
        return currentView.mainNavItems.filter((item) => {
            const accessibleByPermission = checkPermissions(
                item.requiredPermissions,
                permissions
            );
            const accessibleByRole = checkRoles(
                item.requiredRoles,
                roles
            );
            const accessibleByMixed = checkMixed(
                item.requiredMixed,
                permissions,
                roles
            )
            return accessibleByPermission && accessibleByRole && accessibleByMixed;
        })
    }, [currentView, permissions, roles]);

    const accessibleFooterNavItems = useMemo((): NavItem[] | undefined => {
        return currentView.footerNavItems?.filter((item) => {
            const accessibleByPermission = checkPermissions(
                item.requiredPermissions,
                permissions
            );
            const accessibleByRole = checkRoles(
                item.requiredRoles,
                roles
            );
            const accessibleByMixed = checkMixed(
                item.requiredMixed,
                permissions,
                roles
            )
            return accessibleByPermission && accessibleByRole && accessibleByMixed;
        })
    }, [currentView, permissions, roles]);

    // Suggest a view based on the current URL if no view is selected
    useEffect(() => {
        const currentPath = page.url;

        // Only suggest a view if we're on a page that might need a different view
        const suggestedView = registry.findViewForUrl(currentPath);

        if (suggestedView && suggestedView.id !== currentView.id) {
            // Check if the current view can also handle this URL
            const currentViewCanHandleUrl = currentView.urlPatterns?.some((pattern) => {
                if (pattern.endsWith('*')) {
                    const prefix = pattern.slice(0, -1);
                    return currentPath.startsWith(prefix);
                }
                return currentPath === pattern || currentPath.startsWith(`${pattern}/`);
            });

            // Only switch if the current view can't handle this URL
            if (!currentViewCanHandleUrl) {
                setCurrentViewState(suggestedView);
            }
        }
    }, [page.url, currentView, registry]);

    // Get views that the user has permission to access
    const accessibleViews = registry.getAccessibleViews(permissions, roles);

    return (
        <PanelViewContext.Provider
            value={{
                currentView,
                setCurrentView,
                availableViews: registry.getAllViews(),
                accessibleViews,
                accessibleMainNavItems,
                accessibleFooterNavItems,
                registerView,
                unregisterView,
            }}
        >
            {children}
        </PanelViewContext.Provider>
    );
}

// Create a hook to use the context
export function usePanelView() {
    const context = useContext(PanelViewContext);
    if (context === undefined) {
        throw new Error('usePanelView must be used within a PanelViewProvider');
    }
    return context;
}
