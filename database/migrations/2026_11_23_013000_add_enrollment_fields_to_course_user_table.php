<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('course_user', function (Blueprint $table) {
            if (!Schema::hasColumn('course_user', 'enrolled_start_date')) {
                $table->date('enrolled_start_date')->nullable()->after('user_id');
            }
            if (!Schema::hasColumn('course_user', 'enrolled_end_date')) {
                $table->date('enrolled_end_date')->nullable()->after('enrolled_start_date');
            }
            if (!Schema::hasColumn('course_user', 'status')) {
                $table->string('status', 30)->default('active')->after('enrolled_end_date');
            }
            if (!Schema::hasColumn('course_user', 'completed_at')) {
                $table->timestamp('completed_at')->nullable()->after('status');
            }
        });

        // Rellenar inscripciones existentes con las fechas del curso y estado active
        DB::table('course_user')
            ->join('courses', 'course_user.course_id', '=', 'courses.id')
            ->update([
                'course_user.enrolled_start_date' => DB::raw('COALESCE(course_user.enrolled_start_date, courses.start_date)'),
                'course_user.enrolled_end_date' => DB::raw('COALESCE(course_user.enrolled_end_date, courses.end_date)'),
                'course_user.status' => DB::raw("COALESCE(course_user.status, 'active')"),
            ]);
    }

    public function down(): void
    {
        Schema::table('course_user', function (Blueprint $table) {
            $columns = array_filter([
                Schema::hasColumn('course_user', 'completed_at') ? 'completed_at' : null,
                Schema::hasColumn('course_user', 'status') ? 'status' : null,
                Schema::hasColumn('course_user', 'enrolled_end_date') ? 'enrolled_end_date' : null,
                Schema::hasColumn('course_user', 'enrolled_start_date') ? 'enrolled_start_date' : null,
            ]);

            if (!empty($columns)) {
                $table->dropColumn($columns);
            }
        });
    }
};