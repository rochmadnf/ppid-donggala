<?php

namespace App\Http\Controllers\Console\Profile;

use App\Enums\CurriculumVitaeTypeEnum;
use App\Enums\EducationLevelEnum;
use App\Enums\MaritalStatusEnum;
use App\Enums\ReligionEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\CurriculumVitaeRequest;
use App\Http\Requests\Profile\PublicOfficerRequest;
use App\Http\Traits\HandlePaginationTrait;
use App\Http\Traits\PageTrait;
use App\Models\Profile\CurriculumVitaeOfficer;
use App\Repositories\Contracts\Profile\PublicOfficerRepositoryInterface;
use Illuminate\Http\RedirectResponse;
use Inertia\Response as InertiaResponse;

class PublicOfficerController extends Controller
{
    use HandlePaginationTrait, PageTrait;

    protected string $pageId = 'a19cc394-4736-4cf7-a557-65080dd2d9a2';

    protected array $relations = ['office', 'position'];

    protected int $defaultPerPage = 10;

    protected function breadcrumbs(array $extraItems = [], string $from = 'console'): array
    {
        return [
            'group_id' => 'a11f84e6-b499-40b0-a1cb-44d66ba1c327',
            'items' => [
                [
                    'id' => $this->pageId,
                    'label' => $from === 'console' ? 'Pejabat Publik' : 'Profil',
                    'url' => $from === 'console' ? route('console.profile.public-officers.index') : '#',
                ],
                ...$extraItems,
            ],
        ];
    }

    public function __construct(
        private readonly PublicOfficerRepositoryInterface $poRepo,
    ) {}

    public function index(): InertiaResponse
    {

        $page = match (request()->route()->getName()) {
            'console.profile.public-officers.index' => [
                'component' => 'console/profile/public-officers/index',
                'breadcrumbs' => $this->breadcrumbs(),
                'resources' => $this->poRepo->paginate(relations: $this->relations, searchFields: ['fullname'], perPage: $this->defaultPerPage),
            ],
            'profile.public-officers.index' => ['component' => 'landing/profile/public-officers/index', 'breadcrumbs' => $this->breadcrumbs(from: 'landing', extraItems: [
                [
                    'id' => $this->pageId,
                    'label' => 'Pejabat Publik',
                    'url' => route('profile.public-officers.index'),
                ],
            ]), 'resources' => $this->poRepo->all()],
            default => abort(404),
        };

        return inertia($page['component'], [
            ...$this->pageDetails(
                title: 'Pejabat Publik',
                desc: 'Informasi Pejabat Publik Pemerintah Kabupaten Donggala',
                breadcrumbs: $page['breadcrumbs'],
            ),
            'resources' => $page['resources'],
            'options' => [
                'educations' => EducationLevelEnum::options(),
                'religions' => ReligionEnum::options(),
                'maritalStatuses' => MaritalStatusEnum::options(),
            ],
        ]);
    }

    public function store(PublicOfficerRequest $request): RedirectResponse
    {
        $this->poRepo->create($request->whenFulfill());

        return back()->with('success', 'Pejabat publik berhasil ditambahkan!');
    }

    public function show(string $poid): InertiaResponse
    {
        $publicOfficer = $this->poRepo->find(value: $poid, columnName: 'uuid', relations: [...$this->relations, 'curriculumVitaeOfficers'], resourceParams: ['isDetail' => true]);

        return inertia('console/profile/public-officers/show', [
            ...$this->pageDetails(
                title: $publicOfficer->fullname,
                desc: "{$publicOfficer->position->name} - {$publicOfficer->office->name}",
                breadcrumbs: $this->breadcrumbs(extraItems: [
                    [
                        'id' => $publicOfficer->id,
                        'label' => $publicOfficer->fullname,
                        'url' => route('console.profile.public-officers.show', ['poid' => $publicOfficer->id]),
                    ],
                ]),
            ),
            'resources' => [
                'data' => $publicOfficer->resolve(),
            ],
            'options' => [
                'educations' => EducationLevelEnum::options(),
                'religions' => ReligionEnum::options(),
                'maritalStatuses' => MaritalStatusEnum::options(),
                'cvCategories' => CurriculumVitaeTypeEnum::options(),
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

    public function storeCv(CurriculumVitaeRequest $request, string $poid): RedirectResponse
    {
        $publicOfficer = $this->poRepo->find(value: $poid, columnName: 'uuid', wrap: false);

        $publicOfficer->curriculumVitaeOfficers()->create($request->whenFulfill());

        return back()->with('success', 'Curriculum vitae berhasil ditambahkan!');
    }

    public function updateCv(CurriculumVitaeRequest $request, int $cvid): RedirectResponse
    {
        $cv = CurriculumVitaeOfficer::findOrFail($cvid);

        $cv->update($request->whenFulfill());

        return back()->with('success', 'CV berhasil diperbarui!');
    }

    public function destroyCv(int $cvid): RedirectResponse
    {
        $cv = CurriculumVitaeOfficer::findOrFail($cvid);
        $cv->delete();

        return back()->with('success', 'CV berhasil dihapus!');
    }
}
