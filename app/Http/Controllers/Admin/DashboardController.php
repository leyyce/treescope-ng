<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use App\Models\UserActivity;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard with dynamic data.
     */
    public function index()
    {
        // Get user statistics
        $totalUsers = User::count();
        $newUsersToday = User::whereDate('created_at', Carbon::today())->count();
        $activeUsers = User::whereDate('last_activity', '>=', Carbon::now()->subDay())->count();

        $userStats = [
            'totalUsers' => $totalUsers,
            'newUsersToday' => $newUsersToday,
            'activeUsers' => $activeUsers,
        ];

        // Get role distribution with colors
        $roleColors = [
            'Admin' => 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            'Expert' => 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            'User' => 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        ];

        $roles = Role::all()->reject(function($role) {
            return $role->name === 'Guest';
        });
        $roleDistribution = [];

        foreach ($roles as $role) {
            $count = $role->users()->count();
            $color = $roleColors[$role->name] ?? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';

            $roleDistribution[] = [
                'name' => $role->name,
                'count' => $count,
                'color' => $color,
            ];
        }

        // Get recent users
        $recentUsers = User::with('roles')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->roles->first() ? $user->roles->first()->name : 'No Role',
                    'created_at' => $user->created_at,
                ];
            });

        // Get system activity from the user_activities table
        $systemActivity = UserActivity::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($activity) {
                return [
                    'action' => $activity->action,
                    'user' => $activity->user->username,
                    'timestamp' => $activity->created_at,
                    'details' => $activity->details,
                ];
            })
            ->all();

        // If no activities exist yet, create some sample data based on user registrations and roles
        if (empty($systemActivity)) {
            // Use recent user registrations
            $recentRegistrations = User::select('username', 'created_at')
                ->orderBy('created_at', 'desc')
                ->limit(3)
                ->get()
                ->map(function ($user) {
                    return [
                        'action' => 'User Created',
                        'user' => 'system',
                        'timestamp' => $user->created_at,
                        'details' => "Created new user account for {$user->username}",
                    ];
                });

            // Add some role updates
            $recentRoleUpdates = DB::table('model_has_roles')
                ->join('users', 'model_has_roles.model_id', '=', 'users.id')
                ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
                ->select('users.username', 'roles.name as role_name', 'users.created_at')
                ->orderBy('users.created_at', 'desc')
                ->limit(2)
                ->get()
                ->map(function ($item) {
                    return [
                        'action' => 'Role Updated',
                        'user' => 'admin',
                        'timestamp' => $item->created_at,
                        'details' => "Assigned {$item->role_name} role to {$item->username}",
                    ];
                });

            // Combine and sort activities
            $systemActivity = $recentRegistrations->concat($recentRoleUpdates)
                ->sortByDesc('timestamp')
                ->values()
                ->all();
        }

        return Inertia::render('admin/dashboard', [
            'userStats' => $userStats,
            'roleDistribution' => $roleDistribution,
            'recentUsers' => $recentUsers,
            'systemActivity' => $systemActivity,
        ]);
    }
}
