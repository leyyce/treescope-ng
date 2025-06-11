<?php

namespace Database\Seeders;

use App\Models\TrustLevel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TrustLevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultTrustLevels = [
            ['name' => 'Untrusted', 'description' => 'A user with no trust'],
            ['name' => 'Partially Trusted', 'description' => 'A user with some trust'],
            ['name' => 'Trusted', 'description' => 'A user with full trust'],
        ];

        foreach ($defaultTrustLevels as $trustLevelData) {
            // Check if the role already exists by name before creating to prevent duplicates
            TrustLevel::firstOrCreate(
                ['name' => $trustLevelData['name']],
                ['description' => $trustLevelData['description']]
            );
        }
    }
}
