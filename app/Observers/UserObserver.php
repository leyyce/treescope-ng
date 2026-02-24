<?php

namespace App\Observers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class UserObserver
{
    /**
     * Handle the User "created" event.
     *
     * @param \App\Models\User $user
     * @return void
     */
    public function created(User $user): void
    {
        // Prüfen, ob die Rolle existiert (genau wie in deinem alten Code)
        $defaultRole = Role::where('name', 'User')->first();

        if ($defaultRole) {
            // Die elegante Spatie-Methode nutzen, statt attach()
            $user->assignRole($defaultRole);
        } else {
            // Den Warnhinweis loggen, ohne dass die Registrierung abstürzt
            Log::warning('Default role "User" not found in the database. User ' . $user->id . ' was created without a default role.');
        }
    }
}
