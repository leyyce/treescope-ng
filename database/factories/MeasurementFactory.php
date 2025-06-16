<?php

namespace Database\Factories;

use App\Models\Tree;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Measurement>
 */
class MeasurementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tree_id' => Tree::inRandomOrder()->first() ?? Tree::factory()->create(),
            'user_id' => User::inRandomOrder()->first() ?? User::factory()->create(),
            'height' => fake()->randomFloat(2, 1, 999),
            'inclination' => fake()->numberBetween(0, 90),
            'trunk_diameter' => fake()->numberBetween(1, 100),
            'note' => fake()->text(),
        ];
    }
}
