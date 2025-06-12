<?php

namespace Database\Seeders;

use App\Models\TreeType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TreeTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultTreeTypes = [
            ['name' => 'Amerikanische Birke', 'scientific_name' => 'Betula alleghaniensis', 'description' => 'Amerikanische Birke', 'a' => 0.8, 'b' => -1.0119, 'c' => 0.4244, 'd' => 0.0075, 'e' => -0.00004, 'f' => 0.0000001, 'g' => null],
            ['name' => 'Gemeine Fichte', 'scientific_name' => 'Picea abies', 'description' => 'Gemeine Fichte', 'a' => 10, 'b' => -1.3638, 'c' => 0.4216, 'd' => 0.0041, 'e' => -0.00003, 'f' => 0.0000001, 'g' => null],
            ['name' => 'Waldkiefer', 'scientific_name' => 'Pinus sylvestris', 'description' => 'Waldkiefer', 'a' => 1.5, 'b' => -0.8569, 'c' => 0.3074, 'd' => 0.003, 'e' => -0.00003, 'f' => 0.0000001, 'g' => null],
            ['name' => 'Unbekannt', 'scientific_name' => null, 'description' => 'Baumart nicht Bekannt', 'a' => null, 'b' => null, 'c' => null, 'd' => null, 'e' => null, 'f' => null, 'g' => null],
            ['name' => 'Andere', 'scientific_name' => null, 'description' => 'Baumart ist nicht gelistet', 'a' => null, 'b' => null, 'c' => null, 'd' => null, 'e' => null, 'f' => null, 'g' => null],
        ];

        foreach ($defaultTreeTypes as $treeTypeData) {
            TreeType::firstOrCreate($treeTypeData);
        }
    }
}
