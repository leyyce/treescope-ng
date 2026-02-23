<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Models\Role as SpatieRole;

/**
 * @property string $id
 * @property string $name
 * @property string $guard_name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Permission> $permissions
 * @property-read int|null $permissions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $users
 * @property-read int|null $users_count
 * @method static \Database\Factories\RoleFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role permission($permissions, $without = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role whereGuardName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role withoutPermission($permissions)
 * @mixin \Eloquent
 */
class Role extends SpatieRole
{
    /** @use HasFactory<\Database\Factories\RoleFactory> */
    use HasFactory, HasUuids;

    /**
     * Grant the given permission(s) to a role.
     *
     * @param  string|int|array|\Spatie\Permission\Contracts\Permission|\Illuminate\Support\Collection|\BackedEnum  $permissions
     * @return $this
     */
    public function givePermissionTo(...$permissions): static
    {
        $result = parent::givePermissionTo(...$permissions);
        $this->touch();
        return $result;
    }

    /**
     * Remove all current permissions and set the given ones.
     *
     * @param  string|int|array|\Spatie\Permission\Contracts\Permission|\Illuminate\Support\Collection|\BackedEnum  $permissions
     * @return $this
     */
    public function syncPermissions(...$permissions): static
    {
        $result = parent::syncPermissions(...$permissions);
        $this->touch();
        return $result;
    }

    /**
     * Revoke the given permission(s).
     *
     * @param  \Spatie\Permission\Contracts\Permission|\Spatie\Permission\Contracts\Permission[]|string|string[]|\BackedEnum  $permission
     * @return $this
     */
    public function revokePermissionTo($permission): static
    {
        $result = parent::revokePermissionTo($permission);
        $this->touch();
        return $result;
    }
}
