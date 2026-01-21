<?php

namespace App\Http\Controllers\Console;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PublicInformationController extends Controller
{
    protected function categories(string $name): array
    {
        $categories = [
            'berkala' => [
                'id' => 'a0e34990-9bfe-4128-bed1-ef29068e2bab',
                'title' => 'Berkala',
            ],
            'setiap-saat' => [
                'id' => 'a0e349b7-39e7-49ce-87ff-ac72a9704d14',
                'title' => 'Setiap Saat',
            ],
            'serta-merta' => [
                'id' => 'a0e370ac-54a6-459f-be98-6d77208ac5b1',
                'title' => 'Serta Merta',
            ],
            'dikecualikan' => [
                'id' => 'a0e371a0-e1fb-4f36-afda-1102447a8e50',
                'title' => 'Dikecualikan',
            ],
        ];

        return $categories[$name];
    }
    public function index(string $category)
    {
        return inertia('console/public-information/index', [
            'page' => [...$this->categories($category), 'title' => 'Informasi Publik - ' . $this->categories($category)['title']],
        ]);
    }
}
