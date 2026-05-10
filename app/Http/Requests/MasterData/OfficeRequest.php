<?php

namespace App\Http\Requests\MasterData;

use App\Enums\OfficeRankEnum;
use Illuminate\Foundation\Http\FormRequest;
use SanderMuller\FluentValidation\FluentRule;
use SanderMuller\FluentValidation\HasFluentRules;

class OfficeRequest extends FormRequest
{
    use HasFluentRules;

    protected string $baseRouteName = 'console.master-data.offices';

    protected array $originalValues = [];


    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->originalValues = array_merge($this->originalValues, [
            'name' => $this->input('name'),
            'alias' => $this->input('alias'),
        ]);

        $this->merge([
            'name' => str()->of($this->input('name'))->lower()->trim()->value,
            'alias' => str()->of($this->input('alias'))->lower()->trim()->value,
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => FluentRule::string()->bail()->required()->min(3)->max(175)->unique(table: 'offices', column: 'name', callback: fn($_u) => $this->routeIs($this->baseRouteName . '.update') ? $_u->ignore(id: $this->route('office_id'), idColumn: 'uuid') : null),
            'alias' => FluentRule::string()->bail()->required()->min(3)->max(175)->different('name')->unique(table: 'offices', column: 'alias', callback: fn($_u) => $this->routeIs($this->baseRouteName . '.update') ? $_u->ignore(id: $this->route('office_id'), idColumn: 'uuid') : null),
            'rank_id' => FluentRule::string()->bail()->required()->enum(OfficeRankEnum::class),
            'address' => FluentRule::string()->bail()->nullable()->min(3)->max(150),
            'phone' => FluentRule::field()->bail()->nullable()->rule('numeric')->rule('digits_between:8,15'),
            'site_url' => FluentRule::string()->bail()->nullable()->url()->max(150),
        ];
    }

    protected function passedValidation(): void
    {
        $this->merge($this->originalValues);
    }

    public function validated($key = null, $default = null): array
    {
        $data = parent::validated();

        // remove unnecessary field
        unset($data['rank_id']);

        // map data to match database column
        $data['rank'] = $this->input('rank_id');
        $data['name'] = $this->input('name');
        $data['alias'] = $this->input('alias');

        return $data;
    }

    public function attributes()
    {
        return [
            'name' => 'Nama OPD',
            'alias' => 'Singkatan',
            'rank_id' => 'Tingkat',
            'address' => 'Alamat',
            'phone' => 'No. HP / Telepon',
            'site_url' => 'Situs Web',
        ];
    }
}
