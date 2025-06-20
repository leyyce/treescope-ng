<?php

namespace App\Observers;

use App\Models\Role;
use App\Models\User;

class UserObserver
{
    /**
     * Handle the User "created" event.
     *
     * @param  \App\Models\User  $user
     * @return void
     */
    public function created(User $user): void
    {
        $defaultRole = Role::whereName('User')->first();

        if ($defaultRole) {
            $user->roles()->attach($defaultRole); // Attach the default role
        } else {
            \Log::warning('Default role "member" not found in the database. User ' . $user->id . ' was created without a default role.');
        }
    }
}
