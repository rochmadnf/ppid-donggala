<?php

namespace App\Http\Requests\Profile;

use App\Enums\{EducationLevelEnum, MaritalStatusEnum, ReligionEnum};
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\{Rule, Validator};
use SanderMuller\FluentValidation\{FluentRule, HasFluentRules};

class PublicOfficerRequest extends FormRequest
{
    use HasFluentRules;

    protected string $baseRouteName = 'console.profile.public-officers';

    protected ?object $resolvedPosition = null;

    protected function updateRoute(): bool
    {
        return $this->route()->getName() === "{$this->baseRouteName}.update";
    }

    protected function updatePhotoRoute(): bool // Fix: string → bool
    {
        return $this->route()->getName() === "{$this->baseRouteName}.photo.update";
    }

    public function authorize(): bool
    {
        return auth()->user()->getRoleNames()->first() === config('permission.superior_role_name');
    }

    protected function prepareForValidation(): void
    {
        if ($this->updatePhotoRoute()) return;

        $office = DB::table('offices')
            ->where('uuid', $this->input('office.id'))
            ->select(['id', 'rank'])
            ->first();

        $this->resolvedPosition = DB::table('positions')
            ->where('uuid', $this->input('position.id'))
            ->select(['id', 'only_for'])
            ->first();

        $this->merge([
            'office' => [
                ...$this->input('office', []),
                'id'   => $office?->id,
                'rank' => $office?->rank,
            ],
            'position' => [
                ...$this->input('position', []),
                'id' => $this->resolvedPosition?->id,
            ],
        ]);
    }

    public function withValidator(Validator $validator): void
    {
        if ($this->updatePhotoRoute()) return;

        $validator->after(function (Validator $validator) {
            // Skip jika salah satu sudah punya error (misal: required gagal)
            if ($validator->errors()->hasAny(['office.id', 'position.id'])) return;

            // Validasi only_for menggunakan data yang sudah di-cache, tanpa query tambahan
            if ($this->resolvedPosition?->only_for !== $this->office['rank']) {
                $validator->errors()->add(
                    'position.id',
                    'Jabatan tidak valid untuk perangkat daerah yang dipilih.'
                );
            }
        });
    }

    protected function photoUpdateRules(): array
    {
        return [
            'photo' => FluentRule::image()
                ->max("2mb")
                ->minWidth(40)
                ->maxWidth(800)
                ->minHeight(50)
                ->maxHeight(1000)
                ->mimes('jpg', 'jpeg', 'png', 'webp')
                ->required(),
        ];
    }

    protected function baseRules(): array
    {
        return [
            'name'           => FluentRule::string()->bail()->required()->min(3)->max(100),
            'last_education' => FluentRule::enum(EducationLevelEnum::class)->bail()->required(),
            'birth_date'     => FluentRule::date()->bail()->required()->beforeToday()->format('Y-m-d\TH:i:s.u\Z'),
            'birth_place'    => FluentRule::string()->bail()->required()->min(3)->max(100),
            'religion'       => FluentRule::enum(ReligionEnum::class)->bail()->required(),
            'marital_status' => FluentRule::enum(MaritalStatusEnum::class)->bail()->required(),
            'gender'         => FluentRule::boolean()->bail()->required(),
            'is_active'      => FluentRule::boolean()->bail()->required(),

            'office.id'      => FluentRule::integer()->bail()->required(),

            'position.id'    => [
                'bail',
                'required',
                'integer',
                ...($this->is_active ? [
                    Rule::unique(table: 'public_officers', column: 'position_id')
                        ->where(fn($q) => $q->where('office_id', $this->office['id']))
                        ->ignore(
                            $this->updateRoute() ? $this->id : null,
                            'uuid'
                        ),
                ] : []),
            ],

            'period_start' => FluentRule::date()->bail()->required()->beforeToday()->format('Y-m-d\TH:i:s.u\Z'),
            'period_end'   => FluentRule::date()->bail()
                ->requiredIf(fn() => !$this->is_active)
                ->nullable()
                ->when(
                    value: fn() => !is_null($this->period_start),
                    callback: fn($rule) => $rule->after($this->period_start)
                )
                ->format('Y-m-d\TH:i:s.u\Z'),
        ];
    }

    public function attributes(): array
    {
        return [
            'name'           => 'Nama',
            'last_education' => 'Pendidikan Terakhir',
            'birth_date'     => 'Tanggal Lahir',
            'birth_place'    => 'Tempat Lahir',
            'religion'       => 'Agama',
            'marital_status' => 'Status Perkawinan',
            'is_active'      => 'Status Keaktifan',
            'period_start'   => 'Periode Awal',
            'period_end'     => 'Periode Akhir',
            'office.id'      => 'Perangkat Daerah',
            'position.id'    => 'Jabatan',
        ];
    }

    public function messages(): array
    {
        return [
            'date_format'      => "Format tanggal harus 'Hari-Bulan-Tahun'",
            'period_end.after' => "Tanggal Periode Akhir harus setelah tanggal Periode Awal",
        ];
    }

    public function rules(): array
    {
        return match ($this->route()->getName()) {
            "{$this->baseRouteName}.photo.update" => $this->photoUpdateRules(),
            default                               => $this->baseRules(),
        };
    }

    protected function setToLocalTz(string $date, string $format = 'Y-m-d'): string
    {
        return Carbon::parse($date)->setTimezone(config('app.timezone'))->format($format);
    }

    public function whenFulfill(): array
    {
        $data = $this->validated();

        if (!$this->hasFile('photo')) {
            $data = array_merge($data, [
                'fullname'     => $data['name'],
                'birth_date'   => $this->setToLocalTz($data['birth_date']),
                'office_id'    => $this->office['id'],
                'position_id'  => $this->position['id'],
                'period_start' => $this->setToLocalTz($data['period_start']),
                'period_end'   => !is_null($data['period_end']) ? $this->setToLocalTz($data['period_end']) : null,
            ]);
        }

        return $data;
    }
}
