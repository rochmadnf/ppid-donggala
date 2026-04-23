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
        Schema::create('public_officers', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->index();
            $table->string('fullname');
            $table->string('birth_place');
            $table->date('birth_date');
            $table->unsignedTinyInteger('last_education');
            $table->boolean('gender');
            $table->unsignedTinyInteger('religion');
            $table->unsignedTinyInteger('marital_status');
            $table->foreignId('position_id')->constrained('positions')->cascadeOnDelete();
            $table->foreignId('office_id')->constrained('offices')->cascadeOnDelete();
            $table->date('period_start');
            $table->date('period_end')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('photo')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('public_officers');
    }
};
