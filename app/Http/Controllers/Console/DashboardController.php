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
                'title' => 'Dashboard',
            ],
        ]);
    }
}
