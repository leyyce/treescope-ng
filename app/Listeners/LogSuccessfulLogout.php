<?php


namespace App\Listeners;

use App\Models\UserActivity;
use Illuminate\Auth\Events\Logout;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class LogSuccessfulLogout
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Logout $event): void
    {
        UserActivity::log(
            $event->user,
            'Logout',
            'User logged out successfully',
            request()->ip()
        );
    }
}
