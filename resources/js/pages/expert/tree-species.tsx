import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { InertiaPaginator } from '@/components/inertia_paginator';
import { Paginator, BreadcrumbItem, TreeSpecies } from '@/types';
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
import { usePermissions } from '@/hooks/use-permissions';

interface TreeSpeciesPageProps {
  treeSpecies: Paginator<TreeSpecies>;
  filters: {
    search: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Expert Dashboard',
    href: '/expert/dashboard',
  },
  {
    title: 'Tree Species',
    href: '/expert/tree-species',
  },
];

export default function TreeSpeciesPage({ treeSpecies, filters }: TreeSpeciesPageProps) {
    const { hasPermissions } = usePermissions();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTreeSpecies, setEditingTreeSpecies] = useState<TreeSpecies | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingTreeSpecies, setDeletingTreeSpecies] = useState<TreeSpecies | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [viewingTreeSpecies, setViewingTreeSpecies] = useState<TreeSpecies | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [shouldResetCreateForm, setShouldResetCreateForm] = useState(false);
  const [shouldResetEditForm, setShouldResetEditForm] = useState(false);

  const createForm = useForm({
    name: '',
    scientific_name: '',
    description: '',
    a: '',
    b: '',
    c: '',
    d: '',
    e: '',
    f: '',
    g: '',
  });

  const editForm = useForm({
    name: '',
    scientific_name: '',
    description: '',
    a: '',
    b: '',
    c: '',
    d: '',
    e: '',
    f: '',
    g: '',
  });

  const deleteForm = useForm();
  const searchForm = useForm({ search: filters.search || '' });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createForm.post(route('expert.tree-species.store'), {
      onSuccess: () => {
        setShouldResetCreateForm(true);
        setIsCreateDialogOpen(false);
        toast.success('Tree species created successfully');
      },
      onError: (errors) => {
        toast.error(errors.error || 'Failed to create tree species');
      },
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTreeSpecies) return;

    editForm.put(route('expert.tree-species.update', { treeSpecies: editingTreeSpecies.id }), {
      onSuccess: () => {
        setShouldResetEditForm(true);
        setIsEditDialogOpen(false);
        setEditingTreeSpecies(null);
        toast.success('Tree species updated successfully');
      },
      onError: (errors) => {
        toast.error(errors.error || 'Failed to update tree species');
      },
    });
  };

  const handleDelete = () => {
    if (!deletingTreeSpecies) return;

    deleteForm.delete(route('expert.tree-species.destroy', { treeSpecies: deletingTreeSpecies.id }), {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setDeletingTreeSpecies(null);
        toast.success('Tree species deleted successfully');
      },
      onError: (errors) => {
        toast.error(errors.error || 'Failed to delete tree species');
      },
    });
  };

  const openEditDialog = (species: TreeSpecies) => {
    setEditingTreeSpecies(species);
    editForm.setData({
      name: species.name,
      scientific_name: species.scientific_name || '',
      description: species.description,
      a: species.a?.toString() || '',
      b: species.b?.toString() || '',
      c: species.c?.toString() || '',
      d: species.d?.toString() || '',
      e: species.e?.toString() || '',
      f: species.f?.toString() || '',
      g: species.g?.toString() || '',
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (species: TreeSpecies) => {
    setDeletingTreeSpecies(species);
    setIsDeleteDialogOpen(true);
  };

  const openViewDialog = (species: TreeSpecies) => {
    setViewingTreeSpecies(species);
    setIsViewDialogOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchForm.get(route('expert.tree-species'), {
      preserveState: true,
      only: ['treeSpecies', 'filters'],
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tree Species Management" />
      <Toaster position="top-center" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Tree Species Management</h1>
          <div className="flex flex-col md:flex-row gap-2">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Search tree species..."
                value={searchForm.data.search}
                onChange={(e) => searchForm.setData('search', e.target.value)}
                className="w-full md:w-auto"
              />
              <Button type="submit" variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>
            {hasPermissions('create tree species') && (
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
                    <span>Add Tree Species</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Tree Species</DialogTitle>
                    <DialogDescription>
                      Add a new tree species to the system.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label htmlFor="name">Name</label>
                        <Input
                          id="name"
                          value={createForm.data.name}
                          onChange={(e) => createForm.setData('name', e.target.value)}
                          className={createForm.errors.name ? 'border-red-500' : ''}
                        />
                        {createForm.errors.name && (
                          <p className="text-sm text-red-500">{createForm.errors.name}</p>
                        )}
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="scientific_name">Scientific Name</label>
                        <Input
                          id="scientific_name"
                          value={createForm.data.scientific_name}
                          onChange={(e) => createForm.setData('scientific_name', e.target.value)}
                          className={createForm.errors.scientific_name ? 'border-red-500' : ''}
                        />
                        {createForm.errors.scientific_name && (
                          <p className="text-sm text-red-500">{createForm.errors.scientific_name}</p>
                        )}
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="description">Description</label>
                        <Textarea
                          id="description"
                          value={createForm.data.description}
                          onChange={(e) => createForm.setData('description', e.target.value)}
                          className={createForm.errors.description ? 'border-red-500' : ''}
                          rows={4}
                        />
                        {createForm.errors.description && (
                          <p className="text-sm text-red-500">{createForm.errors.description}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <label htmlFor="a">Parameter A</label>
                          <Input
                            id="a"
                            type="number"
                            step="0.01"
                            value={createForm.data.a}
                            onChange={(e) => createForm.setData('a', e.target.value)}
                            className={createForm.errors.a ? 'border-red-500' : ''}
                          />
                          {createForm.errors.a && (
                            <p className="text-sm text-red-500">{createForm.errors.a}</p>
                          )}
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="b">Parameter B</label>
                          <Input
                            id="b"
                            type="number"
                            step="0.01"
                            value={createForm.data.b}
                            onChange={(e) => createForm.setData('b', e.target.value)}
                            className={createForm.errors.b ? 'border-red-500' : ''}
                          />
                          {createForm.errors.b && (
                            <p className="text-sm text-red-500">{createForm.errors.b}</p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <label htmlFor="c">Parameter C</label>
                          <Input
                            id="c"
                            type="number"
                            step="0.01"
                            value={createForm.data.c}
                            onChange={(e) => createForm.setData('c', e.target.value)}
                            className={createForm.errors.c ? 'border-red-500' : ''}
                          />
                          {createForm.errors.c && (
                            <p className="text-sm text-red-500">{createForm.errors.c}</p>
                          )}
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="d">Parameter D</label>
                          <Input
                            id="d"
                            type="number"
                            step="0.01"
                            value={createForm.data.d}
                            onChange={(e) => createForm.setData('d', e.target.value)}
                            className={createForm.errors.d ? 'border-red-500' : ''}
                          />
                          {createForm.errors.d && (
                            <p className="text-sm text-red-500">{createForm.errors.d}</p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <label htmlFor="e">Parameter E</label>
                          <Input
                            id="e"
                            type="number"
                            step="0.01"
                            value={createForm.data.e}
                            onChange={(e) => createForm.setData('e', e.target.value)}
                            className={createForm.errors.e ? 'border-red-500' : ''}
                          />
                          {createForm.errors.e && (
                            <p className="text-sm text-red-500">{createForm.errors.e}</p>
                          )}
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="f">Parameter F</label>
                          <Input
                            id="f"
                            type="number"
                            step="0.01"
                            value={createForm.data.f}
                            onChange={(e) => createForm.setData('f', e.target.value)}
                            className={createForm.errors.f ? 'border-red-500' : ''}
                          />
                          {createForm.errors.f && (
                            <p className="text-sm text-red-500">{createForm.errors.f}</p>
                          )}
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="g">Parameter G</label>
                        <Input
                          id="g"
                          type="number"
                          step="0.01"
                          value={createForm.data.g}
                          onChange={(e) => createForm.setData('g', e.target.value)}
                          className={createForm.errors.g ? 'border-red-500' : ''}
                        />
                        {createForm.errors.g && (
                          <p className="text-sm text-red-500">{createForm.errors.g}</p>
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
          <Table id="tree-species-table">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Scientific Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="hidden md:table-cell">A</TableHead>
                <TableHead className="hidden md:table-cell">B</TableHead>
                <TableHead className="hidden md:table-cell">C</TableHead>
                <TableHead className="hidden md:table-cell">D</TableHead>
                <TableHead className="hidden md:table-cell">E</TableHead>
                <TableHead className="hidden md:table-cell">F</TableHead>
                <TableHead className="hidden md:table-cell">G</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {treeSpecies.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 md:hidden">
                    No tree species found
                  </TableCell>
                  <TableCell colSpan={13} className="text-center py-8 hidden md:table-cell">
                    No tree species found
                  </TableCell>
                </TableRow>
              ) : (
                treeSpecies.data.map((species) => (
                  <TableRow key={species.id}>
                    <TableCell className="font-medium">{species.name}</TableCell>
                    <TableCell>{species.scientific_name || '-'}</TableCell>
                    <TableCell className="max-w-xs truncate">{species.description}</TableCell>
                    <TableCell className="hidden md:table-cell">{species.a ?? '-'}</TableCell>
                    <TableCell className="hidden md:table-cell">{species.b ?? '-'}</TableCell>
                    <TableCell className="hidden md:table-cell">{species.c ?? '-'}</TableCell>
                    <TableCell className="hidden md:table-cell">{species.d ?? '-'}</TableCell>
                    <TableCell className="hidden md:table-cell">{species.e ?? '-'}</TableCell>
                    <TableCell className="hidden md:table-cell">{species.f ?? '-'}</TableCell>
                    <TableCell className="hidden md:table-cell">{species.g ?? '-'}</TableCell>
                    <TableCell>{new Date(species.created_at).toLocaleString()}</TableCell>
                    <TableCell>{new Date(species.updated_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                          {hasPermissions('view tree species') && (
                              <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openViewDialog(species)}
                                  className="md:hidden"
                              >
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View Details</span>
                              </Button>
                          )}
                        {hasPermissions('edit tree species') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(species)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        )}
                        {hasPermissions('delete tree species') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteDialog(species)}
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
          <InertiaPaginator paginator={treeSpecies} only={['treeSpecies', 'filters']} scrollTarget="tree-species-table" />
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
              <DialogTitle>Edit Tree Species</DialogTitle>
              <DialogDescription>
                Update the tree species information.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="edit-name">Name</label>
                  <Input
                    id="edit-name"
                    value={editForm.data.name}
                    onChange={(e) => editForm.setData('name', e.target.value)}
                    className={editForm.errors.name ? 'border-red-500' : ''}
                  />
                  {editForm.errors.name && (
                    <p className="text-sm text-red-500">{editForm.errors.name}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edit-scientific_name">Scientific Name</label>
                  <Input
                    id="edit-scientific_name"
                    value={editForm.data.scientific_name}
                    onChange={(e) => editForm.setData('scientific_name', e.target.value)}
                    className={editForm.errors.scientific_name ? 'border-red-500' : ''}
                  />
                  {editForm.errors.scientific_name && (
                    <p className="text-sm text-red-500">{editForm.errors.scientific_name}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edit-description">Description</label>
                  <Textarea
                    id="edit-description"
                    value={editForm.data.description}
                    onChange={(e) => editForm.setData('description', e.target.value)}
                    className={editForm.errors.description ? 'border-red-500' : ''}
                    rows={4}
                  />
                  {editForm.errors.description && (
                    <p className="text-sm text-red-500">{editForm.errors.description}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="edit-a">Parameter A</label>
                    <Input
                      id="edit-a"
                      type="number"
                      step="0.01"
                      value={editForm.data.a}
                      onChange={(e) => editForm.setData('a', e.target.value)}
                      className={editForm.errors.a ? 'border-red-500' : ''}
                    />
                    {editForm.errors.a && (
                      <p className="text-sm text-red-500">{editForm.errors.a}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="edit-b">Parameter B</label>
                    <Input
                      id="edit-b"
                      type="number"
                      step="0.01"
                      value={editForm.data.b}
                      onChange={(e) => editForm.setData('b', e.target.value)}
                      className={editForm.errors.b ? 'border-red-500' : ''}
                    />
                    {editForm.errors.b && (
                      <p className="text-sm text-red-500">{editForm.errors.b}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="edit-c">Parameter C</label>
                    <Input
                      id="edit-c"
                      type="number"
                      step="0.01"
                      value={editForm.data.c}
                      onChange={(e) => editForm.setData('c', e.target.value)}
                      className={editForm.errors.c ? 'border-red-500' : ''}
                    />
                    {editForm.errors.c && (
                      <p className="text-sm text-red-500">{editForm.errors.c}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="edit-d">Parameter D</label>
                    <Input
                      id="edit-d"
                      type="number"
                      step="0.01"
                      value={editForm.data.d}
                      onChange={(e) => editForm.setData('d', e.target.value)}
                      className={editForm.errors.d ? 'border-red-500' : ''}
                    />
                    {editForm.errors.d && (
                      <p className="text-sm text-red-500">{editForm.errors.d}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="edit-e">Parameter E</label>
                    <Input
                      id="edit-e"
                      type="number"
                      step="0.01"
                      value={editForm.data.e}
                      onChange={(e) => editForm.setData('e', e.target.value)}
                      className={editForm.errors.e ? 'border-red-500' : ''}
                    />
                    {editForm.errors.e && (
                      <p className="text-sm text-red-500">{editForm.errors.e}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="edit-f">Parameter F</label>
                    <Input
                      id="edit-f"
                      type="number"
                      step="0.01"
                      value={editForm.data.f}
                      onChange={(e) => editForm.setData('f', e.target.value)}
                      className={editForm.errors.f ? 'border-red-500' : ''}
                    />
                    {editForm.errors.f && (
                      <p className="text-sm text-red-500">{editForm.errors.f}</p>
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edit-g">Parameter G</label>
                  <Input
                    id="edit-g"
                    type="number"
                    step="0.01"
                    value={editForm.data.g}
                    onChange={(e) => editForm.setData('g', e.target.value)}
                    className={editForm.errors.g ? 'border-red-500' : ''}
                  />
                  {editForm.errors.g && (
                    <p className="text-sm text-red-500">{editForm.errors.g}</p>
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
                This will permanently delete the tree species "{deletingTreeSpecies?.name}". This action cannot be undone.
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
              <DialogTitle>Tree Species Details</DialogTitle>
              <DialogDescription>
                Viewing details for tree species.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <h3 className="font-medium">Name</h3>
                <p className="text-sm">{viewingTreeSpecies?.name}</p>
              </div>
              <div className="grid gap-2">
                <h3 className="font-medium">Scientific Name</h3>
                <p className="text-sm">{viewingTreeSpecies?.scientific_name || '-'}</p>
              </div>
              <div className="grid gap-2">
                <h3 className="font-medium">Description</h3>
                <p className="text-sm whitespace-pre-wrap">{viewingTreeSpecies?.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <h3 className="font-medium">Parameter A</h3>
                  <p className="text-sm">{viewingTreeSpecies?.a ?? '-'}</p>
                </div>
                <div className="grid gap-2">
                  <h3 className="font-medium">Parameter B</h3>
                  <p className="text-sm">{viewingTreeSpecies?.b ?? '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <h3 className="font-medium">Parameter C</h3>
                  <p className="text-sm">{viewingTreeSpecies?.c ?? '-'}</p>
                </div>
                <div className="grid gap-2">
                  <h3 className="font-medium">Parameter D</h3>
                  <p className="text-sm">{viewingTreeSpecies?.d ?? '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <h3 className="font-medium">Parameter E</h3>
                  <p className="text-sm">{viewingTreeSpecies?.e ?? '-'}</p>
                </div>
                <div className="grid gap-2">
                  <h3 className="font-medium">Parameter F</h3>
                  <p className="text-sm">{viewingTreeSpecies?.f ?? '-'}</p>
                </div>
              </div>
              <div className="grid gap-2">
                <h3 className="font-medium">Parameter G</h3>
                <p className="text-sm">{viewingTreeSpecies?.g ?? '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <h3 className="font-medium">Created At</h3>
                  <p className="text-sm">{viewingTreeSpecies ? new Date(viewingTreeSpecies.created_at).toLocaleString() : '-'}</p>
                </div>
                <div className="grid gap-2">
                  <h3 className="font-medium">Updated At</h3>
                  <p className="text-sm">{viewingTreeSpecies ? new Date(viewingTreeSpecies.updated_at).toLocaleString() : '-'}</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
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
