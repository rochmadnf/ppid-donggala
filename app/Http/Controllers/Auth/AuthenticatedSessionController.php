<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Response as InertiaResponse;

class AuthenticatedSessionController extends Controller
{
    public function index(): InertiaResponse
    {
        return inertia('auth/login');
    }

    public function login(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(route('console.dashboard', absolute: false));
    }

    public function logout(\Illuminate\Http\Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        if (config('inertia.history.encrypt')) {
            inertia()->clearHistory();
        }

        return to_route('login');
    }
}
