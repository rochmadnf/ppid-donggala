<?php

namespace App\Http\Controllers\Console\Profile;

use App\Enums\EducationLevelEnum;
use App\Enums\MaritalStatusEnum;
use App\Enums\ReligionEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\PublicOfficerRequest;
use App\Http\Traits\{HandlePaginationTrait, PageTrait};
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Response as InertiaResponse;


class PublicOfficerController extends Controller
{
    use PageTrait, HandlePaginationTrait;

    protected string $pageId = 'a19cc394-4736-4cf7-a557-65080dd2d9a2';
    protected array $relations = ['office', 'position'];
    protected int $defaultPerPage = 10;

    protected function breadcrumbs(array $extraItems = []): array
    {
        return [
            'group_id' => 'a11f84e6-b499-40b0-a1cb-44d66ba1c327',
            'items' => [
                [
                    'id'    => $this->pageId,
                    'label' => 'Pejabat Publik',
                    'url'   => route('console.profile.public-officers.index'),
                ],
                ...$extraItems,
            ],
        ];
    }

    public function __construct(
        private readonly \App\Repositories\Contracts\Profile\PublicOfficerRepositoryInterface $poRepo,
    ) {}

    public function index(): InertiaResponse
    {
        return inertia('console/profile/public-officers/index', [
            ...$this->pageDetails(
                title: 'Pejabat Publik',
                desc: 'Informasi Pejabat Publik Pemerintah Kabupaten Donggala',
                breadcrumbs: $this->breadcrumbs(),
            ),
            "resources" => $this->poRepo->paginate(relations: $this->relations, perPage: $this->defaultPerPage),
        ]);
    }


    public function show(string $poid): InertiaResponse
    {
        $publicOfficer = $this->poRepo->find(value: $poid, columnName: 'uuid', relations: $this->relations, resourceParams: ['isDetail' => true]);

        return inertia('console/profile/public-officers/show', [
            ...$this->pageDetails(
                title: $publicOfficer->fullname,
                desc: "{$publicOfficer->position->name}",
                breadcrumbs: $this->breadcrumbs(extraItems: [
                    [
                        'id'    => $publicOfficer->id,
                        'label' => $publicOfficer->fullname,
                        'url'   => route('console.profile.public-officers.show', ['poid' => $publicOfficer->id]),
                    ],
                ]),
            ),
            'resources' => [
                'data' => $publicOfficer->resolve(),
                'educations' => EducationLevelEnum::options(),
                'religions' => ReligionEnum::options(),
                'maritalStatuses' => MaritalStatusEnum::options(),
            ],
        ]);
    }

    public function update(PublicOfficerRequest $request, string $poid): RedirectResponse
    {
        $publicOfficer = $this->poRepo->find(value: $poid, columnName: 'uuid', wrap: false);
        $publicOfficer->update($request->whenFulfill());

        return back()->with('success', 'Data berhasil diperbarui!');
    }

    public function updatePhoto(PublicOfficerRequest $request, string $poid): RedirectResponse
    {
        $publicOfficer = $this->poRepo->find(value: $poid, columnName: 'uuid', wrap: false);

        // Simpan ke storage/app/public/public-officers/photos/
        $photoPath = $request->file('photo')->store('images/public-officers', ['disk' => 'public']);

        delete_file_exists($publicOfficer->photo);

        // Update path foto di database
        $publicOfficer->update([
            'photo' => $photoPath,
        ]);

        return back()->with('success', 'Foto berhasil diperbarui!');
    }

    public function destroy(string $poid): RedirectResponse
    {
        $this->poRepo->delete($poid, 'uuid');

        // Ambil keyword dari referer
        parse_str(parse_url(request()->headers->get('referer', ''), PHP_URL_QUERY), $refererQuery);
        $keyword = $refererQuery['keyword'] ?? null;
        $searchBy = $refererQuery['search_by'] ?? null;

        return $this->redirectToValidPage(
            remaining: $this->poRepo->count($keyword, $searchBy ?? 'name'),
            defaultPerPage: $this->defaultPerPage,
        );
    }
}
