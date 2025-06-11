<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultRoles = [
            ['name' => 'User', 'description' => 'Standard user role with basic permissions'],
            ['name' => 'Moderator', 'description' => 'Moderator role with limited access'],
            ['name' => 'Admin', 'description' => 'Administrator role with full access'],
        ];

        foreach ($defaultRoles as $roleData) {
            // Check if the role already exists by name before creating to prevent duplicates
            Role::firstOrCreate(
                ['name' => $roleData['name']],
                ['description' => $roleData['description']]
            );
        }
    }
}
