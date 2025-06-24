<?php

namespace Database\Seeders;

use App\Models\TreeCondition;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TreeConditionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultTreeConditions = [
            ['name' => 'Exzellent', 'description' => 'Der Baum ist sehr Gesund'],
            ['name' => 'Gut', 'description' => 'Der Baum ist gesund'],
            ['name' => 'In Ordnung', 'description' => 'Die Gesundheit des Baums ist nicht stark beinträchtigt'],
            ['name' => 'Beeinträchtigt', 'description' => 'Die Gesundheit des Baums beeinträchtigt'],
            ['name' => 'Kritisch', 'description' => 'Die Gesundheit des Baums ist stark beeinträchtigt'],
            ['name' => 'Sterbend', 'description' => 'Der Baum befindet sich im sterben'],
            ['name' => 'Tot', 'description' => 'Der Baum ist tot'],
        ];

        foreach ($defaultTreeConditions as $treeConditionData) {
            TreeCondition::firstOrCreate($treeConditionData);
        }
    }
}
