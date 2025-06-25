<?php

namespace Database\Factories;

use App\Models\TreeMeasurement;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TreePhoto>
 */
class TreePhotoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'measurement_id' => TreeMeasurement::inRandomOrder()->first() ?? TreeMeasurement::factory()->create(),
            'user_id' => User::inRandomOrder()->first() ?? User::factory()->create(),
            'path' => fake()->imageUrl(category: 'nature', word: 'tree'),
            'note' => fake()->text(),
        ];
    }
}
