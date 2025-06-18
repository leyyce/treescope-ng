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
 * @method static \Database\Factories\MeasurementFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Measurement newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Measurement newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Measurement query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Measurement whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Measurement whereHeight($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Measurement whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Measurement whereInclination($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Measurement whereNote($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Measurement whereTreeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Measurement whereTrunkDiameter($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Measurement whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Measurement whereUserId($value)
 * @mixin \Eloquent
 */
class Measurement extends Model
{
    /** @use HasFactory<\Database\Factories\MeasurementFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'height',
        'inclination',
        'trunk_diameter',
        'notes'
    ];

    public function tree(): BelongsTo {
        return $this->belongsTo(Tree::class);
    }

    public function treePhotos(): HasMany {
        return $this->hasMany(TreePhoto::class);
    }
}
