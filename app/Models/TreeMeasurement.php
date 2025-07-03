<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * 
 *
 * @property string $id
 * @property string $tree_id
 * @property string $user_id
 * @property string $height
 * @property int $inclination
 * @property int $trunk_diameter
 * @property string|null $note
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Tree $tree
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TreePhoto> $treePhotos
 * @property-read int|null $tree_photos_count
 * @method static \Database\Factories\TreeMeasurementFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeMeasurement newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeMeasurement newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeMeasurement query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeMeasurement whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeMeasurement whereHeight($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeMeasurement whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeMeasurement whereInclination($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeMeasurement whereNote($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeMeasurement whereTreeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeMeasurement whereTrunkDiameter($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeMeasurement whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeMeasurement whereUserId($value)
 * @property-read \App\Models\User $user
 * @mixin \Eloquent
 */
class TreeMeasurement extends Model
{
    /** @use HasFactory<\Database\Factories\TreeMeasurementFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'tree_id',
        'user_id',
        'height',
        'inclination',
        'trunk_diameter',
        'note'
    ];

    public function tree(): BelongsTo
    {
        return $this->belongsTo(Tree::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function treePhotos(): HasMany
    {
        return $this->hasMany(TreePhoto::class);
    }
}
