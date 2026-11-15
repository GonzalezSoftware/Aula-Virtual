<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('modules', function (Blueprint $table) {
            $table->id();
            // Relación con la tabla courses. Si se borra el curso, se borran sus módulos en cascada.
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->integer('order')->default(1); // Para ordenar los módulos secuencialmente
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('modules');
    }
};