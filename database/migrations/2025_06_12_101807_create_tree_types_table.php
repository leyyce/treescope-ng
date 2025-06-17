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
        Schema::create('tree_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('scientific_name')->nullable();
            $table->string('description');
            $table->double('a')->nullable();
            $table->double('b')->nullable();
            $table->double('c')->nullable();
            $table->double('d')->nullable();
            $table->double('e')->nullable();
            $table->double('f')->nullable();
            $table->double('g')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tree_types');
    }
};
