<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Measurement extends Model
{
    /** @use HasFactory<\Database\Factories\MeasurementFactory> */
    use HasFactory;

    protected $fillable = [
        'height',
        'inclination',
        'trunk_diameter',
        'notes'
    ];
}
