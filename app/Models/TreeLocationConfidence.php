<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TreeLocationConfidence extends Model
{
    /** @use HasFactory<\Database\Factories\TreeLocationConfidenceFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'description',
    ];

    public function trees(): HasMany {
        return $this->hasMany(Tree::class);
    }
}
