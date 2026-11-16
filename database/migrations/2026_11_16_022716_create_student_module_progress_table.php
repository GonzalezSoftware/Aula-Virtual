<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Validamos por seguridad si ya existe la tabla para evitar choques
        if (!Schema::hasTable('student_module_progress')) {
            Schema::create('student_module_progress', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->foreignId('module_id')->constrained()->onDelete('cascade');
                $table->boolean('completed')->default(false);
                $table->decimal('exam_score', 5, 2)->nullable();
                $table->timestamp('completed_at')->nullable();
                $table->timestamps();

                $table->unique(['user_id', 'module_id']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('student_module_progress');
    }
};