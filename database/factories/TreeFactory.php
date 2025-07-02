<?php

namespace Database\Factories;

use App\Models\TreeCondition;
use App\Models\TreeLocationConfidence;
use App\Models\TreeSpecies;
use App\Models\User;
use Clickbar\Magellan\Data\Geometries\Point;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tree>
 */
class TreeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first() ?? User::factory()->create(),
            'tree_species_id' => TreeSpecies::inRandomOrder()->first() ?? TreeSpecies::factory()->create(),
            'tree_condition_id' => TreeCondition::inRandomOrder()->first() ?? TreeCondition::factory()->create(),
            'tree_location_confidence_id' => TreeLocationConfidence::inRandomOrder()->first() ?? TreeLocationConfidence::factory()->create(),
            'location' => Point::makeGeodetic(fake()->longitude(), fake()->latitude()),
        ];
    }
}
