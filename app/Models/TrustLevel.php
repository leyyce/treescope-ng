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
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $users
 * @property-read int|null $users_count
 * @method static \Database\Factories\TrustLevelFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrustLevel newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrustLevel newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrustLevel query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrustLevel whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrustLevel whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrustLevel whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrustLevel whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrustLevel whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class TrustLevel extends Model
{
    /** @use HasFactory<\Database\Factories\TrustLevelFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'description',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
