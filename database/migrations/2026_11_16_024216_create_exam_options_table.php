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
        if (!Schema::hasTable('exam_options')) {
            Schema::create('exam_options', function (Blueprint $table) {
                $table->id();
                $table->foreignId('module_exam_id')->constrained('module_exams')->onDelete('cascade'); // Relación con la pregunta
                $table->text('text'); // Texto de la opción de respuesta
                $table->boolean('is_correct')->default(false); // Indica si es la respuesta correcta
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_options');
    }
};