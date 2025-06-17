<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('measurements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tree_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');
            $table->decimal('height', 5);
            $table->unsignedTinyInteger('inclination');
            $table->unsignedInteger('trunk_diameter');
            $table->text('note')->nullable();
            $table->timestamps();
        });

        DB::statement('ALTER TABLE measurements ADD CONSTRAINT chk_measurements_height_positive CHECK (height > 0)');
        DB::statement('ALTER TABLE measurements ADD CONSTRAINT chk_measurements_inclination_max CHECK (inclination <= 90)');
        DB::statement('ALTER TABLE measurements ADD CONSTRAINT chk_measurements_trunk_diameter_positive CHECK (trunk_diameter > 0)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE measurements DROP CONSTRAINT chk_measurements_height_positive');
        DB::statement('ALTER TABLE measurements DROP CONSTRAINT chk_measurements_inclination_max');
        Schema::dropIfExists('measurements');
    }
};
