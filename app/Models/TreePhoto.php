<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

/**
 * 
 *
 * @property string $id
 * @property string $measurement_id
 * @property string $user_id
 * @property string $path
 * @property string|null $note
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Measurement $measurement
 * @property-read \App\Models\Tree|null $tree
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\TreePhotoFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreePhoto newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreePhoto newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreePhoto query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreePhoto whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreePhoto whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreePhoto whereMeasurementId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreePhoto whereNote($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreePhoto wherePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreePhoto whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreePhoto whereUserId($value)
 * @mixin \Eloquent
 */
class TreePhoto extends Model
{
    /** @use HasFactory<\Database\Factories\TreePhotoFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'path',
        'note',
    ];

    public function measurement(): BelongsTo
    {
        return $this->belongsTo(Measurement::class);
    }

    public function tree(): HasOneThrough
    {
        return $this->hasOneThrough(Tree::class, Measurement::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
