<?php

namespace App\Http\Controllers\Console;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PublicInformationController extends Controller
{
    use \App\Http\Traits\PageTrait;

    protected function breadcrumbs($id, $mainLabel, $category): array
    {
        return [
            'group_id' => 'a0e34919-8d50-488b-90b6-20fcea5aa2ee',
            'items' => [
                [
                    'id' => $id,
                    'label' => $mainLabel,
                    'url' => route('console.public-information.index', ['category' => $category]),
                ],
            ]
        ];
    }

    protected function categories(string $name): array
    {
        $categories = [
            'berkala' => [
                'id' => 'a0e34990-9bfe-4128-bed1-ef29068e2bab',
                'desc' => 'Informasi Publik yang wajib disediakan dan diumumkan secara berkala.',
                'title' => 'Berkala',
            ],
            'setiap-saat' => [
                'id' => 'a0e349b7-39e7-49ce-87ff-ac72a9704d14',
                'desc' => 'Informasi Publik yang dapat disediakan dan diumumkan setiap saat.',
                'title' => 'Setiap Saat',
            ],
            'serta-merta' => [
                'id' => 'a0e370ac-54a6-459f-be98-6d77208ac5b1',
                'desc' => 'Informasi Publik yang wajib disediakan dan diumumkan secara serta-merta tanpa penundaan.',
                'title' => 'Serta Merta',
            ],
            'dikecualikan' => [
                'id' => 'a0e371a0-e1fb-4f36-afda-1102447a8e50',
                'desc' => 'Informasi Publik yang dikecualikan untuk diumumkan kepada publik.',
                'title' => 'Dikecualikan',
            ],
        ];

        return $categories[$name];
    }
    public function index(string $category)
    {
        $page = $this->categories($category);

        return inertia('console/public-information/index', [
            ...$this->pageDetails(title: $page['title'], desc: $page['desc'], id: $page['id'], breadcrumbs: $this->breadcrumbs($page['id'], $page['title'], $category)),
        ]);
    }
}
