<?php

use Illuminate\Support\Facades\Storage;

if (! function_exists('storage_asset')) {
    function storage_asset(string $path): string
    {
        return asset('storage/' . ltrim($path, '/'));
    }
}

if (! function_exists('delete_file_exists')) {
    function delete_file_exists(?string $filePath, string $disk = 'public'): void
    {
        if ($filePath && Storage::disk($disk)->exists($filePath)) {
            Storage::disk($disk)->delete($filePath);
        }
    }
}
