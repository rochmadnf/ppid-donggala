<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Resources\Json\JsonResource;

abstract class BaseRepository
{
    protected string $defaultColumnName = 'id';

    public function __construct(protected Model $model, protected string $resource)
    {
        //
    }

    public function paginate(): JsonResource
    {
        $records = $this->model->paginate(perPage: request()->input('per_page', config('pagination.per_page')));

        return $this->resource::collection($records);
    }

    public function find(int|string $value, ?string $columnName = null, string $operator = '=', bool $wrap = true): Model | JsonResource
    {

        $record = $this->model->where(column: $columnName ?? $this->defaultColumnName, operator: $operator, value: $value)->firstOrFail();

        if (!$wrap) {
            return $record;
        }

        return $this->resource::make($record);
    }

    public function update(array $data, string $columnValue, ?string $columnName = null): Model
    {
        $record = $this->find($columnValue, $columnName, wrap: false);

        $record->update($data);

        return $record;
    }

    public function delete(int|string $value, ?string $columnName = null): bool
    {
        $record = $this->find(value: $value, columnName: $columnName ?? $this->defaultColumnName, wrap: false);

        return $record->delete();
    }
}
