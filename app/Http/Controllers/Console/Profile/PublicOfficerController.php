<?php

namespace App\Http\Controllers\Console\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\PublicOfficerRequest;
use Illuminate\Support\Facades\Storage;
use Inertia\Response as InertiaResponse;


class PublicOfficerController extends Controller
{
    use \App\Http\Traits\PageTrait;

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
            'resources' => $publicOfficer,
        ]);
    }

    public function updatePhoto(PublicOfficerRequest $request, string $poid): \Illuminate\Http\RedirectResponse
    {
        $publicOfficer = $this->poRepo->find(value: $poid, columnName: 'uuid', wrap: false);

        // Simpan ke storage/app/public/public-officers/photos/
        $photoPath = $request->file('photo')->store('images/public-officers', ['disk' => 'public']);

        // Hapus foto lama jika ada
        if ($publicOfficer->photo) {
            Storage::disk('public')->delete($publicOfficer->photo);
        }

        // Update path foto di database
        $publicOfficer->update([
            'photo' => $photoPath . '?t=' . now()->timestamp,
        ]);

        return back()->with('success', 'Foto berhasil diperbarui!');
    }
}
