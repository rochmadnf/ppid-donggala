<?php

namespace App\Http\Controllers\Console;

use App\Http\Controllers\Controller;
use Inertia\Response as InertiaResponse;

class DashboardController extends Controller
{
    public function index(): InertiaResponse
    {
        return inertia('console/dashboard', [
            'page' => [
                'id' => 'a0e34911-a5c1-4d73-a38e-257e7e05df97',
                'title' => 'Dashboard',
            ],
        ]);
    }
}
