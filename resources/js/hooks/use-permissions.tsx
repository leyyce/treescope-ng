import { usePage } from '@inertiajs/react';
import { Auth } from '@/types';
import { checkPermissions, checkRoles, checkMixed } from '@/lib/permissions';

/**
 * A hook to check user permissions and roles.
 * Provides functions that can evaluate either a string expression or an array.
 */
export const usePermissions = () => {
    const { permissions, roles } = usePage().props.auth as Auth;

    /**
     * Checks if the user's permissions satisfy the requirements.
     * @param requiredPermissions A logical expression string or an array of permissions (defaults to AND).
     */
    const hasPermissions = (requiredPermissions?: string | string[]): boolean => {
        return checkPermissions(requiredPermissions, permissions);
    };

    /**
     * Checks if the user's roles satisfy the requirements.
     * @param requiredRoles A logical expression string or an array of roles (defaults to AND).
     */
    const hasRoles = (requiredRoles?: string | string[]): boolean => {
        return checkRoles(requiredRoles, roles);
    };

    /**
     * Checks if the user satisfies both permission and role requirements.
     */
    const hasAll = (
        requiredPermissions?: string | string[],
        requiredRoles?: string | string[]
    ): boolean => {
        return hasPermissions(requiredPermissions) && hasRoles(requiredRoles);
    };

    const hasMixed = (
        requiredMixed?: string | string[],
    ): boolean => {
        return checkMixed(requiredMixed, permissions, roles);
    }

    return { hasPermissions, hasRoles, hasAll, hasMixed, permissions, roles};
};
