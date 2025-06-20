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
            ['name' => 'Exzellent', 'description' => 'Der Baum ist sehr Gesund'],
            ['name' => 'Gut', 'description' => 'Der Baum ist gesund'],
            ['name' => 'In Ordnung', 'description' => 'Die Gesundheit des Baums ist nicht stark beinträchtigt'],
            ['name' => 'Beeinträchtigt', 'description' => 'Die Gesundheit des Baums beeinträchtigt'],
            ['name' => 'Kritisch', 'description' => 'Die Gesundheit des Baums ist stark beeinträchtigt'],
            ['name' => 'Sterbend', 'description' => 'Der Baum befindet sich im sterben'],
            ['name' => 'Tot', 'description' => 'Baum ist tot'],
        ];

        foreach ($defaultHealthStatuses as $healthStatusData) {
            HealthStatus::firstOrCreate($healthStatusData);
        }
    }
}
