<?php

namespace App\Http\Requests;

use Clickbar\Magellan\Data\Geometries\Point;
use Clickbar\Magellan\Http\Requests\TransformsGeojsonGeometry;
use Clickbar\Magellan\Rules\GeometryGeojsonRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTreeTypeRequest extends FormRequest
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
            'tree_type_id' => ['required', 'uuid', 'exists:tree_types,id'],
            'health_status_id' => ['required', 'uuid', 'exists:health_statuses,id'],
            'location' => ['required', new GeometryGeojsonRule([Point::class]), 'unique:trees,location'],
        ];
    }

    public function geometries(): array
    {
        return ['location'];
    }
}
