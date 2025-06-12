<?php

namespace Database\Seeders;

use App\Models\HealthStatus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HealthStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultHealthStatuses = [
            ['name' => 'Unbekannt', 'description' => 'Gesundheitszustand nicht bekannt'],
            ['name' => 'Gesund', 'description' => 'Baum ist gesund'],
            ['name' => 'Beeinträchtigt', 'description' => 'Gesundheit des Baums beeinträchtigt'],
        ];

        foreach ($defaultHealthStatuses as $healthStatusData) {
            HealthStatus::firstOrCreate($healthStatusData);
        }
    }
}
