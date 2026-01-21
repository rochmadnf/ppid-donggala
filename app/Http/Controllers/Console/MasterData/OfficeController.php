<?php

namespace App\Http\Controllers\Console\MasterData;

use App\Http\Controllers\Controller;
use Inertia\Response as InertiaResponse;

class OfficeController extends Controller
{
    use \App\Http\Traits\PageTrait;

    protected string $pageId = 'a0e3beae-66d8-4bf3-8863-174f5e278ed3';

    public function index(): InertiaResponse
    {
        return inertia('console/master-data/offices/index', [
            ...$this->details('Perangkat Daerah', 'Halaman untuk menampilkan daftar perangkat daerah.'),
        ]);
    }
}
