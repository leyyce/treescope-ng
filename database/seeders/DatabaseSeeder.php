<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            TrustLevelSeeder::class,
            UserSeeder::class,
            TreeTypeSeeder::class,
            HealthStatusSeeder::class,
            TreeSeeder::class,
            MeasurementSeeder::class,
            TreePhotoSeeder::class,
        ]);
    }
}
