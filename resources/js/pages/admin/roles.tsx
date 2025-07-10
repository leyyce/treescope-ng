import { InertiaPaginator } from '@/components/inertia_paginator';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { Paginator, type BreadcrumbItem, Role, Permission } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface RolesPageProps {
    roles: Paginator<Role>;
    permissions: Permission[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Roles',
        href: '/admin/roles',
    },
];

export default function Roles({ roles, permissions }: RolesPageProps) {
    const { hasPermissions } = usePermissions();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [deletingRole, setDeletingRole] = useState<Role | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [shouldResetCreateForm, setShouldResetCreateForm] = useState(false);
    const [shouldResetEditForm, setShouldResetEditForm] = useState(false);

    const createForm = useForm({
        name: '',
        permissions: [] as string[],
    });

    const editForm = useForm({
        name: '',
        permissions: [] as string[],
    });

    const deleteForm = useForm();

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route('admin.roles.store'), {
            onSuccess: () => {
                // Mark the form for reset when dialog closes
                setShouldResetCreateForm(true);
                setIsCreateDialogOpen(false);
                toast.success('Role created successfully');
            },
            onError: (errors) => {
                toast.error(errors.error || 'Failed to create role');
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRole) return;

        editForm.put(route('admin.roles.update', { role: editingRole.id }), {
            onSuccess: () => {
                // Mark the form for reset when dialog closes
                setShouldResetEditForm(true);
                setIsEditDialogOpen(false);
                setEditingRole(null);
                toast.success('Role updated successfully');
            },
            onError: (errors) => {
                toast.error(errors.error || 'Failed to update role');
            },
        });
    };

    const handleDelete = () => {
        if (!deletingRole) return;

        deleteForm.delete(route('admin.roles.destroy', { role: deletingRole.id }), {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                setDeletingRole(null);
                toast.success('Role deleted successfully');
            },
            onError: (errors) => {
                toast.error(errors.error || 'Failed to delete role');
            },
        });
    };

    const openEditDialog = (role: Role) => {
        setEditingRole(role);
        editForm.setData({
            name: role.name,
            permissions: role.permissions?.map(permission => permission.name) ?? [],
        });
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (role: Role) => {
        setDeletingRole(role);
        setIsDeleteDialogOpen(true);
    };

    const handlePermissionChange = (permissionName: string, checked: boolean, form: typeof createForm | typeof editForm) => {
        const currentPermissions = [...form.data.permissions];

        if (checked) {
            // Add permission if it's not already in the array
            if (!currentPermissions.includes(permissionName)) {
                currentPermissions.push(permissionName);
            }
        } else {
            // Remove permission if it exists in the array
            const index = currentPermissions.indexOf(permissionName);
            if (index !== -1) {
                currentPermissions.splice(index, 1);
            }
        }

        form.setData('permissions', currentPermissions);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Role Management" />
            <Toaster position="top-center" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Role Management</h1>
                    {hasPermissions('create role') && (
                        <Dialog
                            open={isCreateDialogOpen}
                            onOpenChange={(open) => {
                                setIsCreateDialogOpen(open);
                                if (!open && shouldResetCreateForm) {
                                    createForm.reset();
                                    setShouldResetCreateForm(false);
                                }
                            }}>
                            <DialogTrigger asChild>
                                <Button className="flex items-center gap-1">
                                    <Plus className="h-4 w-4" />
                                    <span>Add Role</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Create New Role</DialogTitle>
                                    <DialogDescription>Add a new role to the system. Roles can be assigned to users and have permissions.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreateSubmit}>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <label htmlFor="name">Role Name</label>
                                            <Input
                                                id="name"
                                                value={createForm.data.name}
                                                onChange={(e) => createForm.setData('name', e.target.value)}
                                                placeholder="Editor"
                                                className={createForm.errors.name ? 'border-red-500' : ''}
                                            />
                                            {createForm.errors.name && <p className="text-sm text-red-500">{createForm.errors.name}</p>}
                                        </div>
                                        <div className="grid gap-2">
                                            <label>Permissions</label>
                                            <div className="border rounded-md p-3 space-y-2 max-h-60 overflow-y-auto">
                                                {permissions.map((permission) => (
                                                    <div key={permission.id} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`create-permission-${permission.id}`}
                                                            checked={createForm.data.permissions.includes(permission.name)}
                                                            onCheckedChange={(checked) =>
                                                                handlePermissionChange(permission.name, checked === true, createForm)
                                                            }
                                                        />
                                                        <label
                                                            htmlFor={`create-permission-${permission.id}`}
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                        >
                                                            {permission.name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                            {createForm.errors.permissions && <p className="text-sm text-red-500">{createForm.errors.permissions}</p>}
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={createForm.processing}>
                                            Create
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                <div className="rounded-lg border shadow-sm">
                    <Table id="roles-table">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Permissions</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Updated At</TableHead>
                                <TableHead className="w-[200px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-8 text-center">
                                        No roles found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                roles.data.map((role) => (
                                    <TableRow key={role.id}>
                                        <TableCell>{role.name}</TableCell>
                                        {
                                            role.name === 'Super Admin' ?
                                                <TableCell>This role automatically has all permissions</TableCell>
                                                :
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {role.permissions?.map((permission) => (
                                                            <Badge key={permission.id} variant="outline">
                                                                {permission.name}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                        }
                                        <TableCell>{new Date(role.created_at).toLocaleString()}</TableCell>
                                        <TableCell>{new Date(role.updated_at).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                {(hasPermissions('edit role') && role.name !== 'Super Admin') && (
                                                    <Button variant="outline" size="sm" onClick={() => openEditDialog(role)}>
                                                        <Pencil className="h-4 w-4" />
                                                        <span className="sr-only">Edit</span>
                                                    </Button>
                                                )}
                                                {hasPermissions('delete role') && (
                                                    <Button variant="outline" size="sm" onClick={() => openDeleteDialog(role)}>
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">Delete</span>
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="mt-4">
                    <InertiaPaginator paginator={roles} only={['roles']} scrollTarget="roles-table" />
                </div>

                {/* Edit Dialog */}
                <Dialog
                    open={isEditDialogOpen}
                    onOpenChange={(open) => {
                        setIsEditDialogOpen(open);
                        if (!open && shouldResetEditForm) {
                            editForm.reset();
                            setShouldResetEditForm(false);
                        }
                    }}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Edit Role</DialogTitle>
                            <DialogDescription>Update the role name and permissions. This will affect all users assigned to this role.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <label htmlFor="edit-name">Role Name</label>
                                    <Input
                                        id="edit-name"
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                        className={editForm.errors.name ? 'border-red-500' : ''}
                                    />
                                    {editForm.errors.name && <p className="text-sm text-red-500">{editForm.errors.name}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <label>Permissions</label>
                                    <div className="border rounded-md p-3 space-y-2 max-h-60 overflow-y-auto">
                                        {permissions.map((permission) => (
                                            <div key={permission.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`edit-permission-${permission.id}`}
                                                    checked={editForm.data.permissions.includes(permission.name)}
                                                    onCheckedChange={(checked) =>
                                                        handlePermissionChange(permission.name, checked === true, editForm)
                                                    }
                                                />
                                                <label
                                                    htmlFor={`edit-permission-${permission.id}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {permission.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    {editForm.errors.permissions && <p className="text-sm text-red-500">{editForm.errors.permissions}</p>}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={editForm.processing}>
                                    Update
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Dialog */}
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the role "{deletingRole?.name}". This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
