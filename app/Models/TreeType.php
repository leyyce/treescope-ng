<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TreeType extends Model
{
    /** @use HasFactory<\Database\Factories\TreeTypeFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'scientific_name',
        'description',
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
    ];

    public function trees(): HasMany {
        return $this->hasMany(Tree::class);
    }
}
