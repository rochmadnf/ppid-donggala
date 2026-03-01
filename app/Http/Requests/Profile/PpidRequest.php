<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Arr;

class PpidRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:ppid_profiles'],
            'type' => ['required', 'string', Rule::in(['docs', 'json'])],
            'values' => ['required', 'array'],
        ];

        if ($this->routeIs('console.profile.ppid.update')) {
            $rules['slug'][3] = Rule::exists('ppid_profiles', 'slug');
            $rules = Arr::only($rules, ['values', 'slug']);
        }

        return $rules;
    }
}
