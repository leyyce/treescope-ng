<?php

namespace Database\Factories;

use App\Models\HealthStatus;
use App\Models\TreeType;
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
            'tree_type_id' => TreeType::inRandomOrder()->first() ?? TreeType::factory()->create(),
            'health_status_id' => HealthStatus::inRandomOrder()->first() ?? HealthStatus::factory()->create(),
            'location' => Point::makeGeodetic(fake()->longitude(), fake()->latitude()),
        ];
    }
}
