<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 *
 *
 * @property string $id
 * @property string $name
 * @property string $description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Tree> $trees
 * @property-read int|null $trees_count
 * @method static \Database\Factories\TreeLocationConfidenceFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeLocationConfidence newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeLocationConfidence newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeLocationConfidence query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeLocationConfidence whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeLocationConfidence whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeLocationConfidence whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeLocationConfidence whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeLocationConfidence whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class TreeLocationConfidence extends Model
{
    /** @use HasFactory<\Database\Factories\TreeLocationConfidenceFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'description',
    ];

    public function trees(): HasMany
    {
        return $this->hasMany(Tree::class);
    }
}
