<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // create permissions
        Permission::create(['name' => 'view tree map']);
        Permission::create(['name' => 'view validated tree']);
        Permission::create(['name' => 'view unvalidated tree']);
        Permission::create(['name' => 'create tree']);
        Permission::create(['name' => 'edit tree']);
        Permission::create(['name' => 'edit own unvalidated tree']);
        Permission::create(['name' => 'validate tree']);
        Permission::create(['name' => 'delete tree']);
        Permission::create(['name' => 'delete own unvalidated tree']);
        Permission::create(['name' => 'view validated measurement']);
        Permission::create(['name' => 'view unvalidated measurement']);
        Permission::create(['name' => 'create measurement']);
        Permission::create(['name' => 'edit measurement']);
        Permission::create(['name' => 'edit own unvalidated measurement']);
        Permission::create(['name' => 'validate measurement']);
        Permission::create(['name' => 'delete measurement']);
        Permission::create(['name' => 'delete own unvalidated measurement']);
        Permission::create(['name' => 'access user panel']);
        Permission::create(['name' => 'view user dashboard']);
        Permission::create(['name' => 'access admin panel']);
        Permission::create(['name' => 'view admin dashboard']);
        Permission::create(['name' => 'access expert panel']);
        Permission::create(['name' => 'view expert dashboard']);
        Permission::create(['name' => 'view users']);
        Permission::create(['name' => 'create user']);
        Permission::create(['name' => 'edit user']);
        Permission::create(['name' => 'delete user']);
        Permission::create(['name' => 'view trust levels']);
        Permission::create(['name' => 'create trust level']);
        Permission::create(['name' => 'edit trust level']);
        Permission::create(['name' => 'delete trust level']);
        Permission::create(['name' => 'create tree species']);
        Permission::create(['name' => 'edit tree species']);
        Permission::create(['name' => 'delete tree species']);
        Permission::create(['name' => 'view permissions']);
        Permission::create(['name' => 'create permission']);
        Permission::create(['name' => 'edit permission']);
        Permission::create(['name' => 'delete permission']);
        Permission::create(['name' => 'view roles']);
        Permission::create(['name' => 'create role']);
        Permission::create(['name' => 'edit role']);
        Permission::create(['name' => 'delete role']);

        // update cache to know about the newly created permissions (required if using WithoutModelEvents in seeders)
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();


        // create roles and assign created permissions

        $role = Role::create(['name' => 'Guest']);
        $role->givePermissionTo('view tree map', 'view validated tree', 'view validated measurement');

        // this can be done as separate statements
        $role = Role::create(['name' => 'User']);
        $role->givePermissionTo('view tree map', 'view validated tree', 'view unvalidated tree', 'create tree',
            'edit own unvalidated tree', 'delete own unvalidated tree', 'view validated measurement', 'view unvalidated measurement', 'create measurement', 'edit own unvalidated measurement',
            'delete own unvalidated measurement', 'access user panel', 'view user dashboard');

        // or may be done by chaining
        $role = Role::create(['name' => 'Expert']);
        $role->givePermissionTo('view tree map', 'view validated tree', 'view unvalidated tree', 'create tree',
            'edit tree', 'validate tree', 'delete tree', 'view validated measurement', 'view unvalidated measurement', 'create measurement', 'edit measurement', 'validate measurement',
            'delete measurement', 'access user panel', 'view user dashboard', 'access expert panel', 'view expert dashboard', 'create tree species', 'edit tree species', 'delete tree species');

        $role = Role::create(['name' => 'Admin']);
        $role->givePermissionTo(Permission::all());

        $role = Role::create(['name' => 'Super Admin']); // Always has every permission
        $role->givePermissionTo(Permission::all());
    }
}
