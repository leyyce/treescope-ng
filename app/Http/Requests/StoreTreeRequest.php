<?php

namespace App\Http\Requests;

use Clickbar\Magellan\Data\Geometries\Point;
use Clickbar\Magellan\Http\Requests\TransformsGeojsonGeometry;
use Clickbar\Magellan\Rules\GeometryGeojsonRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTreeRequest extends FormRequest
{
    use TransformsGeojsonGeometry;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

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
            'location' => ['required', new GeometryGeojsonRule([Point::class]), 'unique:trees,location'],
        ];
    }

    public function geometries(): array
    {
        return ['location'];
    }
}
