<?php

namespace App\Http\Controllers\Console\Profile;

use App\Http\Controllers\Controller;
use Inertia\Response as InertiaResponse;


class PublicOfficerController extends Controller
{
    use \App\Http\Traits\PageTrait;

    protected string $pageId = 'a19cc394-4736-4cf7-a557-65080dd2d9a2';

    protected function breadcrumbs(): array
    {
        return [
            'group_id' => 'a11f84e6-b499-40b0-a1cb-44d66ba1c327',
            'items' => [
                [
                    'id' => $this->pageId,
                    'label' => 'Pejabat Publik',
                    'url' => route('console.profile.public-officers.index'),
                ],
            ]
        ];
    }

    public function index(): InertiaResponse
    {
        return inertia('console/profile/public-officers/index', [
            ...$this->pageDetails(
                title: 'Pejabat Publik',
                desc: 'Informasi Pejabat Publik Pemerintah Kabupaten Donggala',
                breadcrumbs: $this->breadcrumbs(),
            ),
            "resources" => [],
        ]);
    }
}
