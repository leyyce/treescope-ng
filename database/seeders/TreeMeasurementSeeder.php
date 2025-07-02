<?php

namespace Database\Seeders;

use App\Models\TreeMeasurement;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TreeMeasurementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TreeMeasurement::factory(5000)->create();
    }
}
