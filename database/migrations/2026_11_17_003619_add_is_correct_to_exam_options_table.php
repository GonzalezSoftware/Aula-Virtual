<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('exam_options', 'is_correct')) {
            Schema::table('exam_options', function (Blueprint $table) {
                $table->boolean('is_correct')->default(false)->after('text');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('exam_options', 'is_correct')) {
            Schema::table('exam_options', function (Blueprint $table) {
                $table->dropColumn('is_correct');
            });
        }
    }
};