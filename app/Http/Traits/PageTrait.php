<?php

namespace App\Http\Traits;

trait PageTrait
{
    public function details(string $title, string $desc = ''): array
    {
        return [
            'page' => [
                'id' => $this->pageId,
                'title' => $title,
                'description' => $desc,
            ],
        ];
    }
}
