<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('exam_attempts')) {
            Schema::table('exam_attempts', function (Blueprint $table) {
                if (!Schema::hasColumn('exam_attempts', 'course_user_id')) {
                    $table->unsignedBigInteger('course_user_id')->nullable()->after('module_id');
                    $table->index('course_user_id', 'exam_attempts_course_user_id_idx');
                }
            });

            DB::statement("
                UPDATE exam_attempts ea
                INNER JOIN modules m ON ea.module_id = m.id
                INNER JOIN course_user cu ON cu.user_id = ea.user_id AND cu.course_id = m.course_id
                SET ea.course_user_id = cu.id
                WHERE ea.course_user_id IS NULL
            ");
        }

        if (Schema::hasTable('student_module_progress')) {
            Schema::table('student_module_progress', function (Blueprint $table) {
                if (!Schema::hasColumn('student_module_progress', 'course_user_id')) {
                    $table->unsignedBigInteger('course_user_id')->nullable()->after('module_id');
                    $table->index('course_user_id', 'student_module_progress_course_user_id_idx');
                }
            });

            DB::statement("
                UPDATE student_module_progress smp
                INNER JOIN modules m ON smp.module_id = m.id
                INNER JOIN course_user cu ON cu.user_id = smp.user_id AND cu.course_id = m.course_id
                SET smp.course_user_id = cu.id
                WHERE smp.course_user_id IS NULL
            ");
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('exam_attempts') && Schema::hasColumn('exam_attempts', 'course_user_id')) {
            Schema::table('exam_attempts', function (Blueprint $table) {
                $table->dropIndex('exam_attempts_course_user_id_idx');
                $table->dropColumn('course_user_id');
            });
        }

        if (Schema::hasTable('student_module_progress') && Schema::hasColumn('student_module_progress', 'course_user_id')) {
            Schema::table('student_module_progress', function (Blueprint $table) {
                $table->dropIndex('student_module_progress_course_user_id_idx');
                $table->dropColumn('course_user_id');
            });
        }
    }
};