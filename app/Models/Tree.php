<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tree extends Model
{
    /** @use HasFactory<\Database\Factories\TreeFactory> */
    use HasFactory;

    public function treeType(): BelongsTo
    {
        return $this->belongsTo(TreeType::class);
    }

    public function healthStatus(): BelongsTo
    {
        return $this->belongsTo(HealthStatus::class);
    }
}
