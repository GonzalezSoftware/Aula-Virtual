<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            if (!Schema::hasColumn('modules', 'order')) {
                $table->unsignedInteger('order')->default(1)->after('exam_end_date');
            }
        });
    }

    public function down(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            if (Schema::hasColumn('modules', 'order')) {
                $table->dropColumn('order');
            }
        });
    }
};