<?php

namespace App\Models;

use Clickbar\Magellan\Data\Geometries\Point;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Tree extends Model
{
    /** @use HasFactory<\Database\Factories\TreeFactory> */
    use HasFactory, HasUuids;

    protected function casts(): array
    {
        return [
            'location' => Point::class,
        ];
    }
    public function treeType(): BelongsTo
    {
        return $this->belongsTo(TreeType::class);
    }

    public function healthStatus(): BelongsTo
    {
        return $this->belongsTo(HealthStatus::class);
    }

    public function measurements(): HasMany
    {
        return $this->hasMany(Measurement::class);
    }

    public function treePhotos(): HasManyThrough
    {
        return $this->hasManyThrough(TreePhoto::class, Measurement::class);
    }
}
