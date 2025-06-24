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
 * @method static \Database\Factories\TreeSpeciesFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeSpecies newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeSpecies newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeSpecies query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeSpecies whereA($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeSpecies whereB($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeSpecies whereC($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeSpecies whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeSpecies whereD($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeSpecies whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeSpecies whereE($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeSpecies whereF($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeSpecies whereG($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeSpecies whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeSpecies whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeSpecies whereScientificName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TreeSpecies whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class TreeSpecies extends Model
{
    /** @use HasFactory<\Database\Factories\TreeSpeciesFactory> */
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
