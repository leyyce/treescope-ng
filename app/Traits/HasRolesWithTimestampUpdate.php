<?php

namespace App\Traits;

use Spatie\Permission\Traits\HasRoles;

trait HasRolesWithTimestampUpdate
{
    use HasRoles {
        assignRole as assignRoleBase;
        removeRole as removeRoleBase;
        syncRoles as syncRolesBase;
    }

    /**
     * Assign the given role to the model.
     *
     * @param array|string|\Spatie\Permission\Contracts\Role ...$roles
     *
     * @return $this
     */
    public function assignRole(...$roles): static
    {
        $result = $this->assignRoleBase(...$roles);
        $this->touch();
        return $result;
    }

    /**
     * Remove the given role from the model.
     *
     * @param array|string|\Spatie\Permission\Contracts\Role ...$roles
     *
     * @return $this
     */
    public function removeRole(...$roles): static
    {
        $result = $this->removeRoleBase(...$roles);
        $this->touch();
        return $result;
    }

    /**
     * Sync the given roles.
     *
     * @param array|\Spatie\Permission\Contracts\Role|\Illuminate\Support\Collection $roles
     *
     * @return $this
     */
    public function syncRoles(...$roles): static
    {
        $result = $this->syncRolesBase(...$roles);
        $this->touch();
        return $result;
    }
}
