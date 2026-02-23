<?php

namespace App\Models;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $user_id
 * @property string $action
 * @property string|null $details
 * @property string|null $ip_address
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\UserActivityFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserActivity newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserActivity newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserActivity query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserActivity whereAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserActivity whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserActivity whereDetails($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserActivity whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserActivity whereIpAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserActivity whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserActivity whereUserId($value)
 * @mixin \Eloquent
 */
class UserActivity extends Model
{
    /** @use HasFactory<\Database\Factories\UserActivityFactory> */
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'action',
        'details',
        'ip_address',
    ];

    /**
     * Get the user that owns the activity.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Log a user activity.
     *
     * @param User $user
     * @param string $action
     * @param string|null $details
     * @param string|null $ipAddress
     * @return UserActivity
     */
    public static function log(Authenticatable $user, string $action, ?string $details = null, ?string $ipAddress = null): UserActivity
    {
        // Update the user's last activity timestamp
        $user->last_activity = now();
        $user->save();

        return self::create([
            'user_id' => $user->id,
            'action' => $action,
            'details' => $details,
            'ip_address' => $ipAddress,
        ]);
    }
}
