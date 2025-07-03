import { usePage } from '@inertiajs/react';
import { Auth } from '@/types';

type UsePermissionsReturn = {
    /**
     * Checks if the user has a given permission.
     * @param name - Name of the permission (e.g. 'create tree').
     * @returns `true`, if user has the permission, `false` otherwise.
     */
    hasPermission: (name: string) => boolean;

    /**
     * Checks if the user has a given role.
     * @param name - Name of the role (e.g. 'Admin').
     * @returns `true`, if user has the role, `false` otherwise.
     */
    hasRole: (name: string) => boolean;

    /** Array with all permissions of the user */
    permissions: string[];

    /** Array with all roles of the user */
    roles: string[];
};

export function usePermissions(): UsePermissionsReturn {
    const { permissions, roles } = usePage().props.auth as Auth;

    const hasPermission = (name: string): boolean => {
        return permissions.includes(name);
    };

    const hasRole = (name: string): boolean => {
        return roles.includes(name);
    };

    return { hasPermission, hasRole, permissions, roles };
}
