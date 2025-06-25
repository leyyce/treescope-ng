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
 * @property string $tree_species_id
 * @property string $tree_condition_id
 * @property Point $location
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\TreeCondition $treeCondition
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Measurement> $measurements
 * @property-read int|null $measurements_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TreePhoto> $treePhotos
 * @property-read int|null $tree_photos_count
 * @property-read \App\Models\TreeSpecies $treeSpecies
 * @method static \Database\Factories\TreeFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tree newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tree newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tree query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tree whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tree whereTreeConditionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tree whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tree whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tree whereTreeSpeciesId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tree whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tree whereUserId($value)
 * @property string $tree_location_confidence_id
 * @property-read \App\Models\TreeLocationConfidence $treeLocationConfidence
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tree whereTreeLocationConfidenceId($value)
 * @mixin \Eloquent
 */
class Tree extends Model
{
    /** @use HasFactory<\Database\Factories\TreeFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'location',
        'tree_species_id',
        'tree_condition_id',
        'tree_location_confidence_id',
    ];

    protected function casts(): array
    {
        return [
            'location' => Point::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function treeSpecies(): BelongsTo
    {
        return $this->belongsTo(TreeSpecies::class);
    }

    public function treeCondition(): BelongsTo
    {
        return $this->belongsTo(TreeCondition::class);
    }

    public function treeLocationConfidence(): BelongsTo
    {
        return $this->belongsTo(TreeLocationConfidence::class);
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
