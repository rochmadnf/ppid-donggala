<?php

namespace App\Http\Requests\Profile;

use App\Enums\{EducationLevelEnum, MaritalStatusEnum, ReligionEnum};
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;
use SanderMuller\FluentValidation\{FluentRule, HasFluentRules};

class PublicOfficerRequest extends FormRequest
{

    use HasFluentRules;

    protected string $baseRouteName = 'console.profile.public-officers';

    public function authorize(): bool
    {
        return auth()->user()->getRoleNames()->first() === config('permission.superior_role_name');
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'office' => [
                ...$this->input('office', []),
                'id' => DB::table('offices')->where('uuid', $this->office['id'])->value('id'),
            ],
            'position' => [
                ...$this->input('position', []),
                'id' => DB::table('positions')->where('uuid', $this->position['id'])->value('id'),
            ],
        ]);
    }

    protected function photoUpdateRules(): array
    {
        return [
            'photo' => FluentRule::image()
                ->max("2mb") // Max 2MB
                ->minWidth(40)
                ->maxWidth(800)
                ->minHeight(50)
                ->maxHeight(1000)
                ->mimes('jpg', 'jpeg', 'png', 'webp')
                ->required(),
        ];
    }

    protected function updateRoute(): string
    {
        return $this->route()->getName() === "{$this->baseRouteName}.update";
    }

    protected function baseRules(): array
    {
        return [
            'name' => FluentRule::string()->bail()->required()->min(3)->max(100),
            'last_education' => FluentRule::enum(EducationLevelEnum::class)->bail()->required(),
            'birth_date' => FluentRule::date()->bail()->required()->beforeToday()->format('Y-m-d\TH:i:s.u\Z'),
            'birth_place' => FluentRule::string()->bail()->required()->min(3)->max(100),
            'religion' => FluentRule::enum(ReligionEnum::class)->bail()->required(),
            'marital_status' => FluentRule::enum(MaritalStatusEnum::class)->bail()->required(),
            'gender' => FluentRule::boolean()->bail()->required(),
            'is_active' => FluentRule::boolean()->bail()->required(),
            'office.id' => FluentRule::integer()->bail()->required()->exists(table: 'offices', column: 'id'),
            'position.id' => FluentRule::integer()->bail()->required()
                ->exists(table: 'positions', column: 'id', callback: fn($eq) => $eq->where('only_for', $this->office['rank']))
                ->unique(
                    table: 'public_officers',
                    column: 'position_id',
                    callback: fn($uq) => ($this->updateRoute()) ? $uq->where('office_id', $this->office['id'])->where('is_active', true)->ignore(id: $this->id, idColumn: 'uuid') : null
                ),
            'period_start' => FluentRule::date()->bail()->required()->beforeToday()->format('Y-m-d\TH:i:s.u\Z'),
            'period_end' => FluentRule::date()->bail()->requiredIf(fn() => !$this->is_active)->nullable()->when(value: fn() => !is_null($this->period_start), callback: function ($rule) {
                return $rule->after($this->period_start);
            })->format('Y-m-d\TH:i:s.u\Z'),
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'Nama',
            'last_education' => 'Pendidikan Terakhir',
            'birth_date' => 'Tanggal Lahir',
            'birth_place' => 'Tempat Lahir',
            'religion' => 'Agama',
            'marital_status' => 'Status Perkawinan',
            'is_active' => 'Status Keaktifan',
            'period_start' => 'Periode Awal',
            'period_end' => 'Periode Akhir',
            'office.id' => 'Perangkat Daerah',
            'position.id' => 'Jabatan',
        ];
    }

    public function messages(): array
    {
        return [
            'date_format' => "Format tanggal harus 'Hari-Bulan-Tahun'",
            'period_end.after' => "Tanggal Periode Akhir harus setelah tanggal Periode Awal",
        ];
    }

    public function rules(): array
    {
        $rules = match ($this->route()->getName()) {
            "{$this->baseRouteName}.photo.update" => $this->photoUpdateRules(),
            default => $this->baseRules(),
        };

        return $rules;
    }

    protected function setToWita(string $date, string $format = 'Y-m-d'): string
    {
        return Carbon::parse($date)->setTimezone(config('app.timezone'))->format($format);
    }

    public function whenFulfill(): array
    {
        $data = $this->validated();

        if (!$this->hasFile('photo')) {
            $data = array_merge($data, [
                'fullname' => $data['name'],
                'birth_date' => $this->setToWita($data['birth_date']),
                'office_id' => $this->office['id'],
                'position_id' => $this->position['id'],
                'period_start' => $this->setToWita($data['period_start']),
                'period_end' => !is_null($data['period_end']) ? $this->setToWita($data['period_end']) : null,
            ]);
        }

        return $data;
    }
}
