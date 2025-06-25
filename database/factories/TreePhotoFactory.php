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
        $mock_paths = [
            'tree-photos/examples/Tree1.jpg',
            'tree-photos/examples/Tree2.jpg',
            'tree-photos/examples/Tree3.jpg',
        ];

        return [
            'tree_measurement_id' => TreeMeasurement::inRandomOrder()->first() ?? TreeMeasurement::factory()->create(),
            'user_id' => User::inRandomOrder()->first() ?? User::factory()->create(),
            'path' => $mock_paths[array_rand($mock_paths)],
            'note' => fake()->text(),
        ];
    }
}
