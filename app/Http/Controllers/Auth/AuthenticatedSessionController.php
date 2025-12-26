<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Inertia\Response as InertiaResponse;

class AuthenticatedSessionController extends Controller
{
    public function index(): InertiaResponse
    {
        return inertia('auth/login');
    }
}
