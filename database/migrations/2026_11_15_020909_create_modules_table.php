<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->string('title');
            
            // NUEVAS FECHAS PARA EL MÓDULO Y LAS EVALUACIONES
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->date('exam_start_date')->nullable();
            $table->date('exam_end_date')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('modules');
    }
};