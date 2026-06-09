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
        'js_val',
        'html'
    ];

    protected $casts = [
        'js_val' => 'array',
    ];
}
