<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

class TreePhoto extends Model
{
    /** @use HasFactory<\Database\Factories\TreePhotoFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'path',
        'note',
    ];

    public function measurement(): BelongsTo
    {
        return $this->belongsTo(Measurement::class);
    }

    public function tree(): HasOneThrough
    {
        return $this->hasOneThrough(Tree::class, Measurement::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
