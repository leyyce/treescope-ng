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
        Permission::create(['name' => 'view map']);
        Permission::create(['name' => 'view validated data']);
        Permission::create(['name' => 'view unvalidated data']);
        Permission::create(['name' => 'add tree']);
        Permission::create(['name' => 'edit tree']);
        Permission::create(['name' => 'edit own unvalidated tree']);
        Permission::create(['name' => 'validate tree']);
        Permission::create(['name' => 'delete tree']);
        Permission::create(['name' => 'delete own unvalidated tree']);
        Permission::create(['name' => 'add measurement']);
        Permission::create(['name' => 'edit measurement']);
        Permission::create(['name' => 'edit own unvalidated measurement']);
        Permission::create(['name' => 'validate measurement']);
        Permission::create(['name' => 'delete measurement']);
        Permission::create(['name' => 'delete own unvalidated measurement']);
        Permission::create(['name' => 'access admin panel']);
        Permission::create(['name' => 'access expert panel']);
        Permission::create(['name' => 'add user']);
        Permission::create(['name' => 'edit user']);
        Permission::create(['name' => 'delete user']);
        Permission::create(['name' => 'add trust level']);
        Permission::create(['name' => 'edit trust level']);
        Permission::create(['name' => 'delete trust level']);
        Permission::create(['name' => 'add tree species']);
        Permission::create(['name' => 'edit tree species']);
        Permission::create(['name' => 'delete tree species']);

        // update cache to know about the newly created permissions (required if using WithoutModelEvents in seeders)
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();


        // create roles and assign created permissions

        $role = Role::create(['name' => 'Guest']);
        $role->givePermissionTo('view map', 'view validated data');

        // this can be done as separate statements
        $role = Role::create(['name' => 'User']);
        $role->givePermissionTo('view map', 'view validated data', 'view unvalidated data', 'add tree',
            'edit own unvalidated tree', 'delete own unvalidated tree', 'add measurement', 'edit own unvalidated measurement',
            'delete own unvalidated measurement');

        // or may be done by chaining
        $role = Role::create(['name' => 'Expert']);
        $role->givePermissionTo('view map', 'view validated data', 'view unvalidated data', 'add tree',
            'edit tree', 'validate tree', 'delete tree', 'add measurement', 'edit measurement', 'validate measurement',
            'delete measurement', 'access expert panel', 'add tree species', 'edit tree species', 'delete tree species');

        $role = Role::create(['name' => 'Admin']);
        $role->givePermissionTo(Permission::all());

        $role = Role::create(['name' => 'Super Admin']); // Always has every permission
        $role->givePermissionTo(Permission::all());
    }
}
