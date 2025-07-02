<?php

namespace App\Http\Requests;

use App\Rules\SpatialUniqueRule;
use Clickbar\Magellan\Data\Geometries\Point;
use Clickbar\Magellan\Http\Requests\TransformsGeojsonGeometry;
use Clickbar\Magellan\Rules\GeometryGeojsonRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTreeSpeciesRequest extends FormRequest
{
    use TransformsGeojsonGeometry;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'tree_species_id' => ['required', 'uuid', 'exists:tree_species,id'],
            'tree_condition_id' => ['required', 'uuid', 'exists:tree_conditions,id'],
            'location' => [
                'required',
                new GeometryGeojsonRule([Point::class]),
                new SpatialUniqueRule('trees', 'location')
            ],
        ];
    }

    public function geometries(): array
    {
        return ['location'];
    }
}
