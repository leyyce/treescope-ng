import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InertiaPaginator } from '@/components/inertia_paginator';
import { Paginator, User, BreadcrumbItem, Role } from '@/types';
import { usePermissions } from '@/hooks/use-permissions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Plus, Pencil, Trash2, Search, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface UsersPageProps {
  users: Paginator<User>;
  roles: Role[];
  filters: {
    search: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Admin Dashboard',
    href: '/admin/dashboard',
  },
  {
    title: 'Users',
    href: '/admin/users',
  },
];

export default function Users({ users, roles, filters }: UsersPageProps) {
  const { hasPermissions } = usePermissions();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [shouldResetCreateForm, setShouldResetCreateForm] = useState(false);
  const [shouldResetEditForm, setShouldResetEditForm] = useState(false);

  const createForm = useForm({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    step_length: 75,
    roles: [] as string[],
  });

  const editForm = useForm({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    step_length: 75,
    roles: [] as string[],
  });

  const deleteForm = useForm();
  const searchForm = useForm({ search: filters.search || '' });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createForm.post(route('admin.users.store'), {
      onSuccess: () => {
        // Mark the form for reset when dialog closes
        setShouldResetCreateForm(true);
        setIsCreateDialogOpen(false);
        toast.success('User created successfully');
      },
      onError: (errors) => {
        toast.error(errors.error || 'Failed to create user');
      },
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    editForm.put(route('admin.users.update', { user: editingUser.id }), {
      onSuccess: () => {
        // Mark the form for reset when dialog closes
        setShouldResetEditForm(true);
        setIsEditDialogOpen(false);
        setEditingUser(null);
        toast.success('User updated successfully');
      },
      onError: (errors) => {
        toast.error(errors.error || 'Failed to update user');
      },
    });
  };

  const handleDelete = () => {
    if (!deletingUser) return;

    deleteForm.delete(route('admin.users.destroy', { user: deletingUser.id }), {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setDeletingUser(null);
        toast.success('User deleted successfully');
      },
      onError: (errors) => {
        toast.error(errors.error || 'Failed to delete user');
      },
    });
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    editForm.setData({
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: '',
      password_confirmation: '',
      step_length: user.step_length,
      roles: user.roles?.map(role => role.name) ?? [],
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setDeletingUser(user);
    setIsDeleteDialogOpen(true);
  };

  const openViewDialog = (user: User) => {
    setViewingUser(user);
    setIsViewDialogOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchForm.get(route('admin.users'), {
      preserveState: true,
      only: ['users', 'filters'],
    });
  };

  const handleRoleChange = (roleName: string, checked: boolean, form: typeof createForm | typeof editForm) => {
    const currentRoles = [...form.data.roles];

    if (checked) {
      // Add role if it's not already in the array
      if (!currentRoles.includes(roleName)) {
        currentRoles.push(roleName);
      }
    } else {
      // Remove role if it exists in the array
      const index = currentRoles.indexOf(roleName);
      if (index !== -1) {
        currentRoles.splice(index, 1);
      }
    }

    form.setData('roles', currentRoles);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="User Management" />
      <Toaster position="top-center" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">User Management</h1>
          <div className="flex flex-col md:flex-row gap-2">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Search users..."
                value={searchForm.data.search}
                onChange={(e) => searchForm.setData('search', e.target.value)}
                className="w-full md:w-auto"
              />
              <Button type="submit" variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>
            {hasPermissions('create user') && (
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
                    <span>Add User</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogDescription>
                      Add a new user to the system. You can assign roles to the user.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label htmlFor="username">Username</label>
                        <Input
                          id="username"
                          value={createForm.data.username}
                          onChange={(e) => createForm.setData('username', e.target.value)}
                          className={createForm.errors.username ? 'border-red-500' : ''}
                        />
                        {createForm.errors.username && (
                          <p className="text-sm text-red-500">{createForm.errors.username}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="grid gap-2">
                          <label htmlFor="first_name">First Name</label>
                          <Input
                            id="first_name"
                            value={createForm.data.first_name}
                            onChange={(e) => createForm.setData('first_name', e.target.value)}
                            className={createForm.errors.first_name ? 'border-red-500' : ''}
                          />
                          {createForm.errors.first_name && (
                            <p className="text-sm text-red-500">{createForm.errors.first_name}</p>
                          )}
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="last_name">Last Name</label>
                          <Input
                            id="last_name"
                            value={createForm.data.last_name}
                            onChange={(e) => createForm.setData('last_name', e.target.value)}
                            className={createForm.errors.last_name ? 'border-red-500' : ''}
                          />
                          {createForm.errors.last_name && (
                            <p className="text-sm text-red-500">{createForm.errors.last_name}</p>
                          )}
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="email">Email</label>
                        <Input
                          id="email"
                          type="email"
                          value={createForm.data.email}
                          onChange={(e) => createForm.setData('email', e.target.value)}
                          className={createForm.errors.email ? 'border-red-500' : ''}
                        />
                        {createForm.errors.email && (
                          <p className="text-sm text-red-500">{createForm.errors.email}</p>
                        )}
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="password">Password</label>
                        <Input
                          id="password"
                          type="password"
                          value={createForm.data.password}
                          onChange={(e) => createForm.setData('password', e.target.value)}
                          className={createForm.errors.password ? 'border-red-500' : ''}
                        />
                        {createForm.errors.password && (
                          <p className="text-sm text-red-500">{createForm.errors.password}</p>
                        )}
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="password_confirmation">Confirm Password</label>
                        <Input
                          id="password_confirmation"
                          type="password"
                          value={createForm.data.password_confirmation}
                          onChange={(e) => createForm.setData('password_confirmation', e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="step_length">Step Length (cm)</label>
                        <Input
                          id="step_length"
                          type="number"
                          min="50"
                          max="100"
                          value={createForm.data.step_length}
                          onChange={(e) => createForm.setData('step_length', parseInt(e.target.value))}
                          className={createForm.errors.step_length ? 'border-red-500' : ''}
                        />
                        {createForm.errors.step_length && (
                          <p className="text-sm text-red-500">{createForm.errors.step_length}</p>
                        )}
                      </div>
                      <div className="grid gap-2">
                        <label>Roles</label>
                        <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
                          {roles.map((role) => (
                            <div key={role.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`create-role-${role.id}`}
                                checked={createForm.data.roles.includes(role.name)}
                                onCheckedChange={(checked) =>
                                  handleRoleChange(role.name, checked === true, createForm)
                                }
                              />
                              <label
                                htmlFor={`create-role-${role.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {role.name}
                              </label>
                            </div>
                          ))}
                        </div>
                        {createForm.errors.roles && (
                          <p className="text-sm text-red-500">{createForm.errors.roles}</p>
                        )}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                      >
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
        </div>

        <div className="rounded-lg border shadow-sm">
          <Table id="users-table">
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Email Verified</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Registered At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.data.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.email_verified_at ? "default" : "secondary"}>
                        {user.email_verified_at ? "Verified" : "Not Verified"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.map((role) => (
                          <Badge key={role.id} variant="outline">
                            {role.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
                    <TableCell>{new Date(user.updated_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                          {hasPermissions('view users') && (
                              <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openViewDialog(user)}
                              >
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View Details</span>
                              </Button>
                          )}
                        {hasPermissions('edit user') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(user)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        )}
                        {hasPermissions('delete user') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteDialog(user)}
                          >
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
          <InertiaPaginator paginator={users} only={['users', 'filters']} scrollTarget="users-table" />
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
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update the user's information and roles.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="edit-username">Username</label>
                  <Input
                    id="edit-username"
                    value={editForm.data.username}
                    onChange={(e) => editForm.setData('username', e.target.value)}
                    className={editForm.errors.username ? 'border-red-500' : ''}
                  />
                  {editForm.errors.username && (
                    <p className="text-sm text-red-500">{editForm.errors.username}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-2">
                    <label htmlFor="edit-first_name">First Name</label>
                    <Input
                      id="edit-first_name"
                      value={editForm.data.first_name}
                      onChange={(e) => editForm.setData('first_name', e.target.value)}
                      className={editForm.errors.first_name ? 'border-red-500' : ''}
                    />
                    {editForm.errors.first_name && (
                      <p className="text-sm text-red-500">{editForm.errors.first_name}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="edit-last_name">Last Name</label>
                    <Input
                      id="edit-last_name"
                      value={editForm.data.last_name}
                      onChange={(e) => editForm.setData('last_name', e.target.value)}
                      className={editForm.errors.last_name ? 'border-red-500' : ''}
                    />
                    {editForm.errors.last_name && (
                      <p className="text-sm text-red-500">{editForm.errors.last_name}</p>
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edit-email">Email</label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editForm.data.email}
                    onChange={(e) => editForm.setData('email', e.target.value)}
                    className={editForm.errors.email ? 'border-red-500' : ''}
                  />
                  {editForm.errors.email && (
                    <p className="text-sm text-red-500">{editForm.errors.email}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edit-password">Password (leave blank to keep current)</label>
                  <Input
                    id="edit-password"
                    type="password"
                    value={editForm.data.password}
                    onChange={(e) => editForm.setData('password', e.target.value)}
                    className={editForm.errors.password ? 'border-red-500' : ''}
                  />
                  {editForm.errors.password && (
                    <p className="text-sm text-red-500">{editForm.errors.password}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edit-password_confirmation">Confirm Password</label>
                  <Input
                    id="edit-password_confirmation"
                    type="password"
                    value={editForm.data.password_confirmation}
                    onChange={(e) => editForm.setData('password_confirmation', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edit-step_length">Step Length (cm)</label>
                  <Input
                    id="edit-step_length"
                    type="number"
                    min="50"
                    max="100"
                    value={editForm.data.step_length}
                    onChange={(e) => editForm.setData('step_length', parseInt(e.target.value))}
                    className={editForm.errors.step_length ? 'border-red-500' : ''}
                  />
                  {editForm.errors.step_length && (
                    <p className="text-sm text-red-500">{editForm.errors.step_length}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <label>Roles</label>
                  <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
                    {roles.map((role) => (
                      <div key={role.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-role-${role.id}`}
                          checked={editForm.data.roles.includes(role.name)}
                          onCheckedChange={(checked) =>
                            handleRoleChange(role.name, checked === true, editForm)
                          }
                        />
                        <label
                          htmlFor={`edit-role-${role.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {role.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  {editForm.errors.roles && (
                    <p className="text-sm text-red-500">{editForm.errors.roles}</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
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
                This will permanently delete the user "{deletingUser?.username}". This action cannot be undone.
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

        {/* View Details Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                Viewing details for user {viewingUser?.username}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <h3 className="font-medium">Username</h3>
                  <p>{viewingUser?.username}</p>
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p>{viewingUser?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <h3 className="font-medium">First Name</h3>
                  <p>{viewingUser?.first_name}</p>
                </div>
                <div>
                  <h3 className="font-medium">Last Name</h3>
                  <p>{viewingUser?.last_name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <h3 className="font-medium">Step Length</h3>
                  <p>{viewingUser?.step_length} cm</p>
                </div>
                <div>
                  <h3 className="font-medium">Email Verified</h3>
                  <p>{viewingUser?.email_verified_at ? "Yes" : "No"}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium">Roles</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {viewingUser?.roles?.map((role) => (
                    <Badge key={role.id} variant="outline">
                      {role.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <h3 className="font-medium">Registered At</h3>
                  <p>{viewingUser ? new Date(viewingUser.created_at).toLocaleString() : ''}</p>
                </div>
                <div>
                  <h3 className="font-medium">Last Updated</h3>
                  <p>{viewingUser ? new Date(viewingUser.updated_at).toLocaleString() : ''}</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={() => setIsViewDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
