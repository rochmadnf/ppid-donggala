<?php

namespace App\Http\Traits;

trait PageTrait
{
    public function pageDetails(string $title, string|bool $id = false, string $desc = '', array $breadcrumbs = []): array
    {
        return [
            'page' => [
                'id' => $id ?: $this->pageId,
                'title' => $title,
                'description' => $desc,
                'breadcrumbs' => $breadcrumbs,
            ],
        ];
    }
}
