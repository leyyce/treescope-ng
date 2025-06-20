import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
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
    [key: string]: unknown; // This allows for additional properties...
}

export interface Tree {
    id: string;
    user_id: string;
    tree_type_id: string;
    health_status_id: string;
    location: {
        type: string;
        coordinates: [number, number]; // [longitude, latitude]
    };
    created_at: string;
    updated_at: string;
    tree_type?: TreeType;
    health_status?: HealthStatus;
    measurements?: Measurement[];
    tree_photos?: TreePhoto[];
}

export interface TreeType {
    id: string;
    name: string;
    scientific_name: string;
    description: string;
    [key: string]: unknown;
}

export interface HealthStatus {
    id: string;
    name: string;
    description: string;
    [key: string]: unknown;
}

export interface Measurement {
    id: string;
    tree_id: string;
    [key: string]: unknown;
}

export interface TreePhoto {
    id: string;
    measurement_id: string;
    [key: string]: unknown;
}
