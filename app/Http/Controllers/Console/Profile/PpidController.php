<?php

declare(strict_types=1);

namespace App\Http\Controllers\Console\Profile;

use App\Http\Controllers\Controller;
use Inertia\Response as InertiaResponse;

class PpidController extends Controller
{
    use \App\Http\Traits\PageTrait;

    protected string $pageId = 'a11f855c-7ee6-4b28-9e15-c745222360c6';

    protected function breadcrumbs(): array
    {
        return [
            'group_id' => 'a11f84e6-b499-40b0-a1cb-44d66ba1c327',
            'items' => [
                [
                    'id' => $this->pageId,
                    'label' => 'Profil PPID',
                    'url' => route('console.profile.ppid.index'),
                ],
            ]
        ];
    }

    public function index(): InertiaResponse
    {
        return inertia('console/profile/ppid/index', [
            ...$this->pageDetails(
                title: 'Profil PPID',
                desc: 'Profil singkat PPID Pemerintah Kabupaten Donggala',
                breadcrumbs: $this->breadcrumbs()
            ),
        ]);
    }
}
