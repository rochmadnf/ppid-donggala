<?php

namespace App\Http\Controllers\Console;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PublicInformationController extends Controller
{
    public function index()
    {
        return inertia('console/public-information/index', [
            'page' => [
                'title' => 'Informasi Publik',
            ],
        ]);
    }
}
