<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TreeType>
 */
class TreeTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->word(),
            'scientific_name' => fake()->word(),
            'description' => fake()->sentence(),
            'a' => fake()->randomFloat(),
            'b' => fake()->randomFloat(),
            'c' => fake()->randomFloat(),
            'd' => fake()->randomFloat(),
            'e' => fake()->randomFloat(),
            'f' => fake()->randomFloat(),
            'g' => fake()->randomFloat(),
        ];
    }
}
