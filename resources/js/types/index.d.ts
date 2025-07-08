import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Paginator<T> {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    current_page_url: string;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string;
    prev_page_url: string;
    path: string;
    from: number;
    to: number;
    links: {
        url: string | undefined;
        label: string;
        active: boolean;
    }[];
    data: T[];
}

export interface Auth {
    user: User;
    roles: string[];
    permissions: string[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    // Optional permissions required to access this item
    requiredPermissions?: string | string[];
    // Optional roles required to access this item
    requiredRoles?: string | string[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;

    [key: string]: unknown;
}

export interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    step_length: number;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;

    [key: string]: unknown;
}

export interface Tree {
    id: string;
    user_id: string;
    tree_species_id: string;
    tree_condition_id: string;
    location: {
        type: string;
        coordinates: [number, number]; // [longitude, latitude]
    };
    created_at: string;
    updated_at: string;
    user?: User;
    tree_species?: TreeSpecies;
    tree_condition?: TreeCondition;
    tree_measurements?: TreeMeasurement[];
    tree_photos?: TreePhoto[];
}

export interface TreeSpecies {
    id: string;
    name: string;
    scientific_name: string;
    description: string;

    [key: string]: unknown;
}

export interface TreeCondition {
    id: string;
    name: string;
    description: string;

    [key: string]: unknown;
}

export interface TreeMeasurement {
    id: string;
    tree_id: string;
    user_id: string;
    height: string;
    inclination: number;
    trunk_diameter: number;
    note: string | null;
    tree: Tree;
    user: User;
    created_at: string;
    updated_at: string;
    tree_photos: TreePhoto[];

    [key: string]: unknown;
}

export interface TreePhoto {
    id: string;
    tree_measurement_id: string;
    user_id: string;
    path: string;
    url: string;
    note: string | null;
    created_at: string;
    updated_at: string;

    [key: string]: unknown;
}
