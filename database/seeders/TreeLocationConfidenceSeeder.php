<?php

namespace Database\Seeders;

use App\Models\TreeLocationConfidence;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TreeLocationConfidenceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultTreeLocationConfidences = [
            ['name' => 'Sehr hoch', 'description' => 'Die genaue Position des Baumes ist bekannt und wurde präzise auf der Karte markiert (z.B. mit GPS-Genauigkeit oder direkt am Baum).'],
            ['name' => 'Hoch', 'description' => 'Der Baum wurde eindeutig identifiziert und der Standort wurde sehr nah an seiner tatsächlichen Position markiert (innerhalb weniger Meter).'],
            ['name' => 'Mittel', 'description' => 'Der Baum wurde identifiziert, aber der genaue Standort ist möglicherweise um einige Meter verschoben oder der Baum befindet sich in einem kleinen Cluster von Bäumen.'],
            ['name' => 'Niedrig', 'description' => 'Der Baum wurde in der Nähe des markierten Punktes gemessen, aber der genaue Standort ist unsicher oder es gibt mehrere ähnliche Bäume in der Nähe.'],
            ['name' => 'Sehr niedrig', 'description' => 'Der Baum wurde nur grob verortet, der genaue Standort ist sehr unsicher.'],
        ];

        foreach ($defaultTreeLocationConfidences as $treeLocationConfidenceData) {
            TreeLocationConfidence::firstOrCreate($treeLocationConfidenceData);
        }
    }
}
