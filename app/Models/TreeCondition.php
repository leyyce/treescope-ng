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
 * @method static \Database\Factories\TreeConditionFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeCondition newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeCondition newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeCondition query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeCondition whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeCondition whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeCondition whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeCondition whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeCondition whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class TreeCondition extends Model
{
    /** @use HasFactory<\Database\Factories\TreeConditionFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'description',
    ];

    public function trees(): HasMany {
        return $this->hasMany(Tree::class);
    }
}
