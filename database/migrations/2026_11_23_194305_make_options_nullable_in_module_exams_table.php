<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('module_exams', function (Blueprint $table) {
            if (Schema::hasColumn('module_exams', 'options')) {
                $table->json('options')->nullable()->change();
            }
        });
    }

    public function down(): void
    {
        Schema::table('module_exams', function (Blueprint $table) {
            if (Schema::hasColumn('module_exams', 'options')) {
                $table->json('options')->nullable(false)->change();
            }
        });
    }
};