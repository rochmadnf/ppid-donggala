<?php

namespace App\Http\Controllers;

use Inertia\Response as InertiaResponse;

class WelcomeController extends Controller
{
    public function __invoke(): InertiaResponse
    {
        return inertia('landing/welcome/index', [
            'page' => [
                'id' => 'a1f3b461-f0f0-40b9-9515-0c1024fb73f4',
            ]
        ]);
    }
}
