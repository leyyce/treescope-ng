<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Support\Facades\Storage;

/**
 * 
 *
 * @property string $id
 * @property string $tree_measurement_id
 * @property string $user_id
 * @property string $path
 * @property string|null $note
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Tree|null $tree
 * @property-read \App\Models\TreeMeasurement $treeMeasurement
 * @property-read mixed $url
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\TreePhotoFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreePhoto newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreePhoto newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreePhoto query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreePhoto whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreePhoto whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreePhoto whereNote($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreePhoto wherePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreePhoto whereTreeMeasurementId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreePhoto whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreePhoto whereUserId($value)
 * @mixin \Eloquent
 */
class TreePhoto extends Model
{
    /** @use HasFactory<\Database\Factories\TreePhotoFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'tree_measurement_id',
        'user_id',
        'path',
        'note',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['url'];

    /**
     * Get the full URL for the photo.
     */
    protected function url(): Attribute
    {
        return Attribute::make(
            get: fn () => Storage::url($this->path),
        );
    }


    public function treeMeasurement(): BelongsTo
    {
        return $this->belongsTo(TreeMeasurement::class);
    }

    public function tree(): HasOneThrough
    {
        return $this->hasOneThrough(Tree::class, TreeMeasurement::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
