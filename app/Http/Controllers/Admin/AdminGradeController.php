<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\ExamAttempt;
use App\Models\StudentModuleProgress;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminGradeController extends Controller
{
    public function index(Request $request)
    {
        $allCourses = Course::orderBy('title')->get(['id', 'title', 'start_date', 'end_date']);

        $students = User::where('email', '!=', 'admin_oculto')
            ->with(['courses' => function ($query) {
                $query->orderBy('title')->with(['modules' => function ($q) {
                    $q->orderBy('order');
                }]);
            }])
            ->orderBy('name')
            ->orderBy('lastname')
            ->get();

        $studentIds = $students->pluck('id');

        $allProgress = StudentModuleProgress::whereIn('user_id', $studentIds)
            ->get()
            ->groupBy('user_id');

        $allAttempts = ExamAttempt::whereIn('user_id', $studentIds)
            ->orderByDesc('attempt_number')
            ->get()
            ->groupBy('user_id');

        $records = [];

        foreach ($students as $student) {
            $userProgressAll = $allProgress->get($student->id, collect());
            $userAttemptsAll = $allAttempts->get($student->id, collect());

            foreach ($student->courses as $course) {
                $enrollmentId = $course->pivot?->id;

                $courseProgress = $userProgressAll->filter(function ($item) use ($enrollmentId) {
                    if ($enrollmentId) {
                        return (int) $item->course_user_id === (int) $enrollmentId || $item->course_user_id === null;
                    }
                    return true;
                });

                $courseAttempts = $userAttemptsAll->filter(function ($item) use ($enrollmentId) {
                    if ($enrollmentId) {
                        return (int) $item->course_user_id === (int) $enrollmentId || $item->course_user_id === null;
                    }
                    return true;
                });

                if ($enrollmentId) {
                    $exactProgress = $courseProgress->where('course_user_id', $enrollmentId);
                    if ($exactProgress->isNotEmpty()) {
                        $courseProgress = $exactProgress;
                    }

                    $exactAttempts = $courseAttempts->where('course_user_id', $enrollmentId);
                    if ($exactAttempts->isNotEmpty()) {
                        $courseAttempts = $exactAttempts;
                    }
                }

                $userProgressByModule = $courseProgress->keyBy('module_id');
                $userAttemptsByModule = $courseAttempts->groupBy('module_id');

                $evaluatedScores = [];

                $modulesList = $course->modules->map(function ($module) use ($userProgressByModule, $userAttemptsByModule, &$evaluatedScores) {
                    $progress = $userProgressByModule->get($module->id);
                    $attempts = $userAttemptsByModule->get($module->id, collect());
                    $attemptsCount = $attempts->count();

                    $bestAttemptScore = $attempts->max('score');
                    $latestAttemptScore = $attempts->first()?->score;

                    $rawScore = $progress?->exam_score ?? $bestAttemptScore;
                    $hasScore = $rawScore !== null;
                    $score = $hasScore ? round((float) $rawScore, 2) : null;

                    if ($hasScore) {
                        $evaluatedScores[] = $score;
                    }

                    $isCompleted = (bool) ($progress?->completed) || $attemptsCount > 0;

                    return [
                        'id' => $module->id,
                        'title' => $module->title,
                        'order' => $module->order,
                        'score' => $score,
                        'latest_score' => $latestAttemptScore !== null ? round((float) $latestAttemptScore, 2) : null,
                        'attempts_count' => $attemptsCount,
                        'max_attempts' => 3,
                        'completed' => $isCompleted,
                        'status' => $hasScore ? 'Calificado' : ($isCompleted ? 'Completado sin nota' : 'Pendiente'),
                    ];
                })->values();

                $totalModulesCount = $modulesList->count();
                $evaluatedModulesCount = count($evaluatedScores);
                $courseAverage = $evaluatedModulesCount > 0
                    ? round(array_sum($evaluatedScores) / $evaluatedModulesCount, 2)
                    : null;

                $fullName = trim(($student->name ?? '') . ' ' . ($student->lastname ?? ''));

                $records[] = [
                    'student_id' => $student->id,
                    'student_name' => $fullName !== '' ? $fullName : ($student->email ?? 'Estudiante'),
                    'cedula' => $student->cedula,
                    'email' => $student->email,
                    'en_espera' => (bool) $student->en_espera,
                    'course_id' => $course->id,
                    'course_title' => $course->title,
                    'course_score' => $courseAverage,
                    'evaluated_modules_count' => $evaluatedModulesCount,
                    'total_modules_count' => $totalModulesCount,
                    'modules' => $modulesList,
                ];
            }
        }

        return Inertia::render('Admin/Grades', [
            'records' => $records,
            'courses' => $allCourses,
        ]);
    }
}