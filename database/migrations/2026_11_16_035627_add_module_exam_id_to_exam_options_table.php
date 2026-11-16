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
    Schema::table('exam_options', function (Blueprint $table) {
        $table->unsignedBigInteger('module_exam_id')->after('id'); // O ajusta la posición con 'after'
        
        // Si quieres agregar la llave foránea con restricción:
        // $table->foreign('module_exam_id')->references('id')->on('module_exams')->onDelete('cascade');
    });
}

public function down(): void
{
    Schema::table('exam_options', function (Blueprint $table) {
        $table->dropColumn('module_exam_id');
    });
}
};
