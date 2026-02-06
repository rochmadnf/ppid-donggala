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
        Schema::create('offices', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->index();
            $table->string('name');
            $table->string('alias');
            $table->string('address');
            $table->string('phone')->nullable();
            $table->string('site_url')->nullable();
            $table->timestamps();
        });

        // merger
        Schema::create('office_mergers', function (Blueprint $table) {
            $table->foreignId('office_id')->constrained('offices')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('merged_office_id')->constrained('offices')->cascadeOnDelete()->cascadeOnUpdate();
            $table->primary(['office_id', 'merged_office_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('office_mergers');
        Schema::dropIfExists('offices');
    }
};
