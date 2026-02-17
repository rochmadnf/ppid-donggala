<?php

namespace App\Http\Controllers\Console\MasterData;

use App\Http\Controllers\Controller;
use Inertia\Response as InertiaResponse;

class OfficeController extends Controller
{
    use \App\Http\Traits\PageTrait;

    public function __construct(private readonly \App\Repositories\Contracts\MasterData\OfficeRepositoryInterface $officeRepository)
    {
        //
    }

    protected string $pageId = 'a0e3beae-66d8-4bf3-8863-174f5e278ed3';

    protected function breadcrumbs(): array
    {
        return [
            'group_id' => 'a0e3be1f-c5e5-405a-ba53-a027a8f91f47',
            'items' => [
                [
                    'id' => $this->pageId,
                    'label' => 'Perangkat Daerah',
                    'url' => route('console.master-data.offices.index'),
                ],
            ]
        ];
    }

    public function index(): InertiaResponse
    {
        return inertia(
            'console/master-data/offices/index',
            [
                ...$this->pageDetails(
                    title: 'Perangkat Daerah',
                    desc: 'Daftar Perangkat Daerah pada lingkup kerja Pemerintahan Kabupaten Donggala.',
                    breadcrumbs: $this->breadcrumbs(),
                ),
                "resources" => $this->officeRepository->paginate(),
            ]
        );
    }
}
