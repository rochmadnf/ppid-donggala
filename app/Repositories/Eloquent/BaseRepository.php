<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;

abstract class BaseRepository
{
    protected string $defaultColumnName = 'id';

    public function __construct(protected Model $model, protected string $resource)
    {
        //
    }

    public function paginate(array $relations = [], array $searchFields = ['name'], int $perPage = 10): JsonResource
    {
        $records = $this->model->when(method_exists($this->model, 'scopeSearchByKeyword'), fn($qSearch) => $qSearch->searchByKeyword($searchFields))->when(count($relations) >= 1, fn($qWith) => $qWith->with($relations))->paginate(perPage: request()->input('per_page', $perPage));

        return $this->resource::collection($records);
    }

    public function find(int|string $value, ?string $columnName = null, array $relations = [], array $resourceParams = [], string $operator = '=', bool $wrap = true): Model | JsonResource
    {

        $record = $this->model
            ->when(count($relations) >= 1, fn($qWith) => $qWith->with($relations))
            ->where(column: $columnName ?? $this->defaultColumnName, operator: $operator, value: $value)
            ->firstOrFail();

        return $wrap ? new $this->resource($record, ...$resourceParams) : $record;
    }

    public function create(array $data): Model
    {
        try {
            DB::beginTransaction();
            $record = $this->model->create($data);
            DB::commit();

            return $record;
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    public function update(array $data, string $columnValue, ?string $columnName = null): Model
    {
        $record = $this->find($columnValue, $columnName, wrap: false);

        $record->update($data);

        return $record;
    }

    public function count(?string $keyword = null, string $defaultColumn = 'name'): int
    {
        return $this->model
            ->when($keyword, fn($q) => $q->where($defaultColumn, 'LIKE', "%{$keyword}%"))
            ->count();
    }

    public function delete(int|string $value, ?string $columnName = null): bool
    {
        $record = $this->find(value: $value, columnName: $columnName ?? $this->defaultColumnName, wrap: false);

        return $record->delete();
    }
}
