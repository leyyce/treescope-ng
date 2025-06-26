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
            'photos' => ['required', 'array', 'between:1,10'],
            'photos.*.file' => ['required', 'file', 'image', 'max:10240'], // 10MB max
            'photos.*.note' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param \Illuminate\Validation\Validator $validator
     * @return void
     */
    public function withValidator(\Illuminate\Validation\Validator $validator): void
    {
        $validator->after(function ($validator) {
            $this->validateNoDuplicatePhotos($validator);
        });
    }

    /**
     * Validate that there are no duplicate photos.
     *
     * @param \Illuminate\Validation\Validator $validator
     * @return void
     */
    protected function validateNoDuplicatePhotos($validator): void
    {
        if (!$this->has('photos') || !is_array($this->photos)) {
            return;
        }

        $fileHashes = [];
        $hasDuplicates = false;

        foreach ($this->photos as $photoData) {
            if (!isset($photoData['file']) || !$photoData['file']->isValid()) {
                continue;
            }

            $file = $photoData['file'];
            $fileHash = md5_file($file->getRealPath());

            if (in_array($fileHash, $fileHashes)) {
                $hasDuplicates = true;
                break;
            }

            $fileHashes[] = $fileHash;
        }

        if ($hasDuplicates) {
            $validator->errors()->add('photos', 'Duplicate photos are not allowed. Please ensure all uploaded photos are unique.');
        }
    }
}
