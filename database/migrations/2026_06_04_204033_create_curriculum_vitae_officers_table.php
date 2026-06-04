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
        Schema::create('curriculum_vitae_officers', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('institution');
            $table->char('period_start', 4);
            $table->string('period_end', 4)->nullable();
            $table->foreignIdFor(\App\Models\Profile\PublicOfficer::class)->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->unsignedSmallInteger('category')->comment('1: Pendidikan, 2: Jabatan, 3: Organisasi');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('curriculum_vitae_officers');
    }
};
