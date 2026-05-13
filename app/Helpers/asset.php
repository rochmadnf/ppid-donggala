<?php

if (! function_exists('storage_asset')) {
    function storage_asset(string $path): string
    {
        return asset('storage/' . ltrim($path, '/'));
    }
}
