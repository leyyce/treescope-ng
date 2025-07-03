<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'username' => 'TreeScope',
            'first_name' => 'Tree',
            'last_name' => 'Scope',
            'password' => Hash::make('a.b.123456'),
            'step_length' => 80,
            'email' => 'admin@treescope.de',
            'email_verified_at' => now(),
        ])->assignRole('Super Admin');
        User::factory(25)->create()->each(function ($user) {
            $user->assignRole('User');
        });
        User::factory(10)->unverified()->create()->each(function ($user) {
            $user->assignRole('User');
        });
    }
}
