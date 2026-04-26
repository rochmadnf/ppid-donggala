<?php

namespace App\Http\Controllers\Console\MasterData;

use App\Http\Controllers\Controller;
use Inertia\Response as InertiaResponse;
use App\Http\Traits\{PageTrait, HandlePaginationTrait};

class OfficeController extends Controller
{

    use PageTrait, HandlePaginationTrait;

    protected int $defaultPerPage = 5;

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
                "resources" => $this->officeRepository->paginate(perPage: $this->defaultPerPage),
            ]
        );
    }

    public function destroy(string $office_id): \Illuminate\Http\RedirectResponse
    {
        $this->officeRepository->delete($office_id, 'uuid');

        // Ambil keyword dari referer
        parse_str(parse_url(request()->headers->get('referer', ''), PHP_URL_QUERY), $refererQuery);
        $keyword = $refererQuery['keyword'] ?? null;
        $searchBy = $refererQuery['search_by'] ?? null;

        return $this->redirectToValidPage(
            remaining: $this->officeRepository->count($keyword, $searchBy ?? 'name'),
            defaultPerPage: $this->defaultPerPage,
        );
    }
}
