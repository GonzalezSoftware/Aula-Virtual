<?php

use Carbon\Carbon;
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
                $table->string('status', 20)->default('active')->after('enrolled_end_date');
            }
            if (!Schema::hasColumn('course_user', 'completed_at')) {
                $table->timestamp('completed_at')->nullable()->after('status');
            }
        });

        Schema::table('exam_attempts', function (Blueprint $table) {
            if (!Schema::hasColumn('exam_attempts', 'course_user_id')) {
                $table->unsignedBigInteger('course_user_id')->nullable()->after('module_id');
                $table->index('course_user_id');
            }
        });

        Schema::table('student_module_progress', function (Blueprint $table) {
            if (!Schema::hasColumn('student_module_progress', 'course_user_id')) {
                $table->unsignedBigInteger('course_user_id')->nullable()->after('module_id');
                $table->index('course_user_id');
            }
        });

        // Rellenar fechas snapshot de inscripciones existentes desde courses
        $enrollments = DB::table('course_user')
            ->join('courses', 'course_user.course_id', '=', 'courses.id')
            ->select(
                'course_user.id',
                'courses.start_date',
                'courses.end_date'
            )
            ->get();

        $today = Carbon::today();

        foreach ($enrollments as $enrollment) {
            $isPastEndDate = $enrollment->end_date
                ? $today->gt(Carbon::parse($enrollment->end_date)->endOfDay())
                : false;

            DB::table('course_user')
                ->where('id', $enrollment->id)
                ->update([
                    'enrolled_start_date' => $enrollment->start_date,
                    'enrolled_end_date' => $enrollment->end_date,
                    'status' => $isPastEndDate ? 'completed' : 'active',
                    'completed_at' => $isPastEndDate ? Carbon::now() : null,
                ]);
        }

        // Vincular intentos y progresos previos a la inscripción existente del mismo usuario y curso
        $attempts = DB::table('exam_attempts')
            ->join('modules', 'exam_attempts.module_id', '=', 'modules.id')
            ->select('exam_attempts.id', 'exam_attempts.user_id', 'modules.course_id')
            ->whereNull('exam_attempts.course_user_id')
            ->get();

        foreach ($attempts as $attempt) {
            $pivotId = DB::table('course_user')
                ->where('user_id', $attempt->user_id)
                ->where('course_id', $attempt->course_id)
                ->orderByDesc('id')
                ->value('id');

            if ($pivotId) {
                DB::table('exam_attempts')
                    ->where('id', $attempt->id)
                    ->update(['course_user_id' => $pivotId]);
            }
        }

        $progressRows = DB::table('student_module_progress')
            ->join('modules', 'student_module_progress.module_id', '=', 'modules.id')
            ->select('student_module_progress.id', 'student_module_progress.user_id', 'modules.course_id')
            ->whereNull('student_module_progress.course_user_id')
            ->get();

        foreach ($progressRows as $row) {
            $pivotId = DB::table('course_user')
                ->where('user_id', $row->user_id)
                ->where('course_id', $row->course_id)
                ->orderByDesc('id')
                ->value('id');

            if ($pivotId) {
                DB::table('student_module_progress')
                    ->where('id', $row->id)
                    ->update(['course_user_id' => $pivotId]);
            }
        }
    }

    public function down(): void
    {
        Schema::table('student_module_progress', function (Blueprint $table) {
            if (Schema::hasColumn('student_module_progress', 'course_user_id')) {
                $table->dropIndex(['course_user_id']);
                $table->dropColumn('course_user_id');
            }
        });

        Schema::table('exam_attempts', function (Blueprint $table) {
            if (Schema::hasColumn('exam_attempts', 'course_user_id')) {
                $table->dropIndex(['course_user_id']);
                $table->dropColumn('course_user_id');
            }
        });

        Schema::table('course_user', function (Blueprint $table) {
            $columns = ['enrolled_start_date', 'enrolled_end_date', 'status', 'completed_at'];
            foreach ($columns as $col) {
                if (Schema::hasColumn('course_user', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};