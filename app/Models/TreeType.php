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
 * @property string|null $scientific_name
 * @property string $description
 * @property float|null $a
 * @property float|null $b
 * @property float|null $c
 * @property float|null $d
 * @property float|null $e
 * @property float|null $f
 * @property float|null $g
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Tree> $trees
 * @property-read int|null $trees_count
 * @method static \Database\Factories\TreeTypeFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeType newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeType newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeType query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeType whereA($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeType whereB($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeType whereC($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeType whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeType whereD($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeType whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeType whereE($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeType whereF($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeType whereG($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeType whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeType whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeType whereScientificName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeType whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class TreeType extends Model
{
    /** @use HasFactory<\Database\Factories\TreeTypeFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'scientific_name',
        'description',
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
    ];

    public function trees(): HasMany {
        return $this->hasMany(Tree::class);
    }
}
