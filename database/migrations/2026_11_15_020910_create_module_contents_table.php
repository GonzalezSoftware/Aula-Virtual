<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('module_contents', function (Blueprint $table) {
            $table->id();
            // Relación con la tabla modules
            $table->foreignId('module_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->enum('type', ['pdf', 'video']); // Restringe a que solo sea PDF o video
            $table->string('file_path')->nullable(); // Ruta del archivo guardado (PDF o video local)
            $table->string('url')->nullable();       // Enlace externo opcional (ej. YouTube)
            $table->integer('order')->default(1);    // Orden del contenido dentro del módulo
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('module_contents');
    }
};