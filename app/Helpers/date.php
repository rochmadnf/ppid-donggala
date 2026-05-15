<?php

declare(strict_types=1);

use Carbon\Carbon;

if (! function_exists('from_format')) {
    function from_format(string $date, string $format = 'd-m-Y'): Carbon
    {
        return Carbon::createFromFormat($format, $date);
    }
}
