<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTreeMeasurementRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'user_id' => auth()->id(),
            'tree_id' => $this->route('tree')->id,
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'tree_id' => ['required', 'exists:trees,id'],
            'user_id' => ['required', 'exists:users,id'],
            'trunk_diameter' => ['required', 'integer', 'min:1'],
            'height' => ['required', 'numeric', 'min:0.01', 'max:999.99'],
            'inclination' => ['required', 'integer', 'min:0', 'max:90'],
            'note' => ['nullable', 'string', 'max:1000'],
            'photos' => ['required', 'array', 'min:2'],
            'photos.*.file' => ['required', 'file', 'image', 'max:10240'], // 10MB max
            'photos.*.note' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'photos.min' => 'At least 2 photos are required.',
            'photos.*.file.required' => 'Each photo upload field must contain a file.',
            'photos.*.file.image' => 'Uploaded files must be images.',
            'trunk_diameter.min' => 'Trunk diameter must be a positive value.',
            'height.min' => 'Tree height must be a positive value.',
            'height.max' => 'Tree height cannot exceed 999.99 meters.',
            'inclination.min' => 'Inclination must be between 0 and 90 degrees.',
            'inclination.max' => 'Inclination must be between 0 and 90 degrees.',
        ];
    }
}
