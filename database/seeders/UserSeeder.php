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
            'username' => 'TestUser',
            'first_name' => 'Test',
            'last_name' => 'User',
            'password' => Hash::make('a.b.123456'),
            'step_length' => 80,
            'email' => 'test.user@example.com',
            'email_verified_at' => now(),
        ]);
        User::factory(25)->create();
        User::factory(10)->unverified()->create();
    }
}
