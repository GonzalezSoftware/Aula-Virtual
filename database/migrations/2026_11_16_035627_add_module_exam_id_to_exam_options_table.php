<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('exam_options', 'module_exam_id')) {
            Schema::table('exam_options', function (Blueprint $table) {
                $table->unsignedBigInteger('module_exam_id')->nullable()->after('id');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('exam_options', 'module_exam_id')) {
            Schema::table('exam_options', function (Blueprint $table) {
                $table->dropColumn('module_exam_id');
            });
        }
    }
};