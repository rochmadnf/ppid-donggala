<?php

namespace App\Http\Requests\Profile;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use SanderMuller\FluentValidation\FluentRule;
use SanderMuller\FluentValidation\HasFluentRules;

class PublicOfficerRequest extends FormRequest
{

    use HasFluentRules;

    protected string $baseRouteName = 'console.profile.public-officers';

    public function authorize(): bool
    {
        return auth()->user()->getRoleNames()->first() === config('permission.superior_role_name');
    }

    protected function photoUpdateRules(): array
    {
        return [
            'photo' => FluentRule::image()
                ->max("2mb") // Max 2MB
                ->minWidth(40)
                ->maxWidth(800)
                ->minHeight(50)
                ->maxHeight(1000)
                ->mimes('jpg', 'jpeg', 'png', 'webp')
                ->required(),
        ];
    }

    public function rules(): array
    {
        $rules = match ($this->route()->getName()) {
            "{$this->baseRouteName}.photo.update" => $this->photoUpdateRules(),
            default => [],
        };

        return $rules;
    }
}
