<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HealthStatus extends Model
{
    /** @use HasFactory<\Database\Factories\HealthStatusFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    public function trees(): HasMany {
        return $this->hasMany(Tree::class);
    }
}
