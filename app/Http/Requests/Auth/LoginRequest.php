<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => ['required', 'string', 'min:5'],
            'password' => ['required', 'string', 'min:8'],
        ];
    }

    public function authenticate()
    {
        if (!Auth::attempt($this->only('username', 'password'), $this->boolean('remember_me'))) {
            throw ValidationException::withMessages([
                'username' => trans('auth.failed'),
            ]);
        }
    }
}
