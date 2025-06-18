<?php

namespace App\Models;

use Clickbar\Magellan\Data\Geometries\Point;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

/**
 * 
 *
 * @property string $id
 * @property string $user_id
 * @property string $tree_type_id
 * @property string $health_status_id
 * @property Point $location
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\HealthStatus $healthStatus
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Measurement> $measurements
 * @property-read int|null $measurements_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TreePhoto> $treePhotos
 * @property-read int|null $tree_photos_count
 * @property-read \App\Models\TreeType $treeType
 * @method static \Database\Factories\TreeFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tree newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tree newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tree query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tree whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tree whereHealthStatusId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tree whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tree whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tree whereTreeTypeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tree whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tree whereUserId($value)
 * @mixin \Eloquent
 */
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
