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
import { Paginator, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface Permission {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
}

interface PermissionsPageProps {
    permissions: Paginator<Permission>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Permissions',
        href: '/admin/permissions',
    },
];

export default function Permissions({ permissions }: PermissionsPageProps) {
    const { hasPermission } = usePermissions();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [deletingPermission, setDeletingPermission] = useState<Permission | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const createForm = useForm({
        name: '',
    });

    const editForm = useForm({
        name: '',
    });

    const deleteForm = useForm();

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route('admin.permissions.store'), {
            onSuccess: () => {
                setIsCreateDialogOpen(false);
                createForm.reset();
                toast.success('Permission created successfully');
            },
            onError: () => {
                toast.error('Failed to create permission');
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPermission) return;

        editForm.put(route('admin.permissions.update', { permission: editingPermission.id }), {
            onSuccess: () => {
                setIsEditDialogOpen(false);
                setEditingPermission(null);
                editForm.reset();
                toast.success('Permission updated successfully');
            },
            onError: () => {
                toast.error('Failed to update permission');
            },
        });
    };

    const handleDelete = () => {
        if (!deletingPermission) return;

        deleteForm.delete(route('admin.permissions.destroy', { permission: deletingPermission.id }), {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                setDeletingPermission(null);
                toast.success('Permission deleted successfully');
            },
            onError: (errors) => {
                toast.error(errors.error || 'Failed to delete permission');
            },
        });
    };

    const openEditDialog = (permission: Permission) => {
        setEditingPermission(permission);
        editForm.setData('name', permission.name);
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (permission: Permission) => {
        setDeletingPermission(permission);
        setIsDeleteDialogOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permission Management" />
            <Toaster position={'top-center'}/>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Permission Management</h1>
                    {hasPermission('add permission') && (
                        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="flex items-center gap-1">
                                    <Plus className="h-4 w-4" />
                                    <span>Add Permission</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create New Permission</DialogTitle>
                                    <DialogDescription>Add a new permission to the system. Permissions can be assigned to roles.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreateSubmit}>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <label htmlFor="name">Permission Name</label>
                                            <Input
                                                id="name"
                                                value={createForm.data.name}
                                                onChange={(e) => createForm.setData('name', e.target.value)}
                                                placeholder="view users"
                                                className={createForm.errors.name ? 'border-red-500' : ''}
                                            />
                                            {createForm.errors.name && <p className="text-sm text-red-500">{createForm.errors.name}</p>}
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
                    <Table id={'permissions-table'}>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead className="w-[200px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {permissions.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={2} className="py-8 text-center">
                                        No permissions found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                permissions.data.map((permission) => (
                                    <TableRow key={permission.id}>
                                        <TableCell>{permission.name}</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                {hasPermission('edit permission') && (
                                                    <Button variant="outline" size="sm" onClick={() => openEditDialog(permission)}>
                                                        <Pencil className="h-4 w-4" />
                                                        <span className="sr-only">Edit</span>
                                                    </Button>
                                                )}
                                                {hasPermission('delete permission') && (
                                                    <Button variant="outline" size="sm" onClick={() => openDeleteDialog(permission)}>
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
                    <InertiaPaginator paginator={permissions} only={['permissions']} scrollTarget={'permissions-table'} />
                </div>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Permission</DialogTitle>
                            <DialogDescription>Update the permission name. This will affect all roles that use this permission.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <label htmlFor="edit-name">Permission Name</label>
                                    <Input
                                        id="edit-name"
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                        className={editForm.errors.name ? 'border-red-500' : ''}
                                    />
                                    {editForm.errors.name && <p className="text-sm text-red-500">{editForm.errors.name}</p>}
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
                                This will permanently delete the permission "{deletingPermission?.name}". This action cannot be undone.
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
