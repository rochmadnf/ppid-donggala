<?php

namespace App\Http\Controllers\Console;

use App\Http\Controllers\Controller;
use Inertia\Response as InertiaResponse;

class DashboardController extends Controller
{
    use \App\Http\Traits\PageTrait;

    protected string $pageId = 'a0e34911-a5c1-4d73-a38e-257e7e05df97';

    protected function breadcrumbs(): array
    {
        return [
            'group_id' => $this->pageId,
            'items' => [
                [
                    'id' => $this->pageId,
                    'label' => 'Dashboard',
                    'url' => route('console.dashboard'),
                ],
            ]
        ];
    }

    public function index(): InertiaResponse
    {
        return inertia('console/dashboard', [
            ...$this->pageDetails(title: 'Dashboard', desc: 'Gambaran umum status dan kinerja aplikasi.', breadcrumbs: $this->breadcrumbs()),
        ]);
    }
}
