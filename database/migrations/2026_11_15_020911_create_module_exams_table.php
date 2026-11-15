<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('module_exams', function (Blueprint $table) {
            $table->id();
            // Relación con la tabla modules
            $table->foreignId('module_id')->constrained()->onDelete('cascade');
            $table->text('question'); // Enunciado de la pregunta
            $table->json('options');  // Almacenará las 4 opciones y su indicador de respuesta correcta en formato JSON
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('module_exams');
    }
};