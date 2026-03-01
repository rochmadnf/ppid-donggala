<?php

namespace App\Models\Profile;

use Illuminate\Database\Eloquent\Model;

class Ppid extends Model
{
    protected $table = 'ppid_profiles';

    protected $fillable = [
        'name',
        'slug',
        'type',
        'values',
    ];

    protected $casts = [
        'values' => 'array',
    ];
}
