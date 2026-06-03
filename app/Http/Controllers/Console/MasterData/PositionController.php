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
                ->where('only_for', request()->integer('for'))
                ->paginate(perPage: 15)
        );


        return response()->json($resources);
    }
}
