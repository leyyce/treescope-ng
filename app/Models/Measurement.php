<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Measurement extends Model
{
    /** @use HasFactory<\Database\Factories\MeasurementFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'height',
        'inclination',
        'trunk_diameter',
        'notes'
    ];

    public function tree(): BelongsTo {
        return $this->belongsTo(Tree::class);
    }

    public function treePhotos(): HasMany {
        return $this->hasMany(TreePhoto::class);
    }
}
