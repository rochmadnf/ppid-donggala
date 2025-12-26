<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Response as InertiaResponse;

class WelcomeController extends Controller
{
    public function __invoke(Request $request): InertiaResponse
    {
        return inertia('landing/welcome/index');
    }
}
