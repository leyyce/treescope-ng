<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * Display a listing of the roles.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);

        $roles = Role::query()
            ->with('permissions')
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();

        $permissions = Permission::orderBy('name')->get();

        return Inertia::render('admin/roles', [
            'roles' => $roles,
            'permissions' => $permissions
        ]);
    }

    /**
     * Store a newly created role in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'array',
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'guard_name' => 'web',
        ]);

        if (isset($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return back()->with('success', 'Role created successfully.');
    }

    /**
     * Update the specified role in storage.
     */
    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'permissions' => 'array',
        ]);

        $role->update([
            'name' => $validated['name'],
        ]);

        if (isset($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return back()->with('success', 'Role updated successfully.');
    }

    /**
     * Remove the specified role from storage.
     */
    public function destroy(Role $role)
    {
        // Check if any users are using the role
        if ($role->users()->count() > 0) {
            return redirect()->route('admin.roles')->with('error', 'Cannot delete role as it is assigned to one or more users.');
        }

        // Prevent deleting system roles
        $systemRoles = ['Super Admin', 'Admin', 'Expert', 'User', 'Guest'];
        if (in_array($role->name, $systemRoles)) {
            return back()->withErrors(['error' => 'Cannot delete system role.']);
        }

        $role->delete();

        return back()->with('success', 'Role deleted successfully.');
    }
}
