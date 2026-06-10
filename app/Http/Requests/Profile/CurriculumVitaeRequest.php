<?php

namespace App\Http\Requests\Profile;

use App\Enums\CurriculumVitaeTypeEnum;
use Illuminate\Foundation\Http\FormRequest;
use Override;
use SanderMuller\FluentValidation\FluentRule;
use SanderMuller\FluentValidation\HasFluentRules;

class CurriculumVitaeRequest extends FormRequest
{
    use HasFluentRules;

    public function authorize(): bool
    {
        return auth()->user()->getRoleNames()->first() === config('permission.superior_role_name');
    }

    #[Override]
    public function attributes()
    {
        return [
            'title' => 'Jenjang/Jabatan',
            'institution' => 'Institusi/Instansi/Organisasi',
            'period.s' => 'Tahun Mulai',
            'period.e' => 'Tahun Selesai',
        ];
    }

    public function rules(): array
    {
        return [
            'title' => FluentRule::string()->bail()->required()->min(2)->max(100),
            'institution' => FluentRule::string()->bail()->required()->min(2)->max(150),
            'period.s' => FluentRule::numeric()->bail()->required()->min(1900)->max(date('Y')),
            'period.e' => FluentRule::numeric()->bail()->nullable()->min($this->input('period.s'))->max(date('Y')),
            'category' => FluentRule::enum(CurriculumVitaeTypeEnum::class)->bail()->required(),
        ];
    }

    public function whenFulfill(): array
    {
        $data = $this->validated();

        return array_merge($data, [
            'period_start' => $data['period']['s'],
            'period_end' => $data['period']['e'] ?? null,
        ]);
    }
}
