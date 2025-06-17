<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HealthStatus extends Model
{
    /** @use HasFactory<\Database\Factories\HealthStatusFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'description',
    ];

    public function trees(): HasMany {
        return $this->hasMany(Tree::class);
    }
}
