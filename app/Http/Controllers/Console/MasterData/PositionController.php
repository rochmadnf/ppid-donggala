<?php

namespace App\Http\Controllers\Console\MasterData;

use App\Http\Controllers\Controller;
use App\Http\Resources\MasterData\PositionResource;
use App\Models\MasterData\Position;
use Illuminate\Http\JsonResponse;

class PositionController extends Controller
{
    public function index(): JsonResponse
    {
        $resources = PositionResource::collection(
            Position::searchByKeyword(['name'])
                ->where('only_for', request()->integer('rank'))
                ->where(fn($oq) => $oq->whereNull('office_id')->orWhere('office_id', request()->string('office_id')))
                ->orderBy('rank')
                ->paginate(perPage: 8)
        );


        return response()->json($resources);
    }
}
