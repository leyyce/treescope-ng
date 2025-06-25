<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\DB;

class SpatialUniqueRule implements ValidationRule
{
    /**
     * The table to check for uniqueness.
     *
     * @var string
     */
    protected $table;

    /**
     * The column to check for uniqueness.
     *
     * @var string
     */
    protected $column;

    /**
     * The ID to ignore (if updating an existing record).
     *
     * @var mixed
     */
    protected $ignore;

    /**
     * Create a new rule instance.
     *
     * @param string $table
     * @param string $column
     * @param mixed $ignore
     */
    public function __construct(string $table, string $column, $ignore = null)
    {
        $this->table = $table;
        $this->column = $column;
        $this->ignore = $ignore;
    }

    /**
     * Run the validation rule.
     *
     * @param \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Parse the GeoJSON to get coordinates
        $geojson = json_decode($value, true);

        if (!$geojson || !isset($geojson['coordinates']) || count($geojson['coordinates']) !== 2) {
            $fail('The :attribute must be a valid GeoJSON Point.');
            return;
        }

        $lng = $geojson['coordinates'][0];
        $lat = $geojson['coordinates'][1];

        // Build the query to check for existing points at the same location
        // Use ST_DWithin with a very small distance threshold (0.000001 degrees, approximately 10cm)
        // This helps catch points that are effectively at the same location even if there are minor differences
        $query = DB::table($this->table)
            ->whereRaw("ST_DWithin({$this->column}::geography, ST_GeomFromText('POINT({$lng} {$lat})', 4326)::geography, 0.1)");

        // If we're updating an existing record, ignore it
        if ($this->ignore) {
            $query->where('id', '!=', $this->ignore);
        }

        // If a record exists with the same location, validation fails
        if ($query->exists()) {
            $fail('A tree already exists at this location.');
        }
    }
}
