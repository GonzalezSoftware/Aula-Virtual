<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\ExamAttempt;
use App\Models\Module;
use App\Models\StudentModuleProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentGradeController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $userId = $user->id;

        // Cursos asignados al estudiante (con su pivote de inscripción)
        $enrolledCourses = $user->courses()->get();
        $assignedCourseIds = $enrolledCourses->pluck('id');
        $enrollmentIdByCourse = $enrolledCourses->mapWithKeys(fn ($c) => [$c->id => $c->pivot?->id]);

        // También incluir cursos donde el estudiante tenga progreso o intentos registrados
        $progressModuleIds = StudentModuleProgress::where('user_id', $userId)->pluck('module_id');
        $attemptModuleIds = ExamAttempt::where('user_id', $userId)->pluck('module_id');
        $extraCourseIds = Module::whereIn('id', $progressModuleIds->merge($attemptModuleIds)->unique())
            ->pluck('course_id');

        $courseIds = $assignedCourseIds->merge($extraCourseIds)->unique()->values();

        $courses = Course::whereIn('id', $courseIds)
            ->with(['modules' => function ($query) {
                $query->orderBy('order');
            }])
            ->get();

        $allProgress = StudentModuleProgress::where('user_id', $userId)->get();
        $allAttempts = ExamAttempt::where('user_id', $userId)
            ->orderByDesc('attempt_number')
            ->get();

        $gradesData = $courses->map(function ($course) use ($allProgress, $allAttempts, $enrollmentIdByCourse) {
            $enrollmentId = $enrollmentIdByCourse->get($course->id);

            $courseProgress = $allProgress->filter(function ($item) use ($enrollmentId) {
                if ($enrollmentId) {
                    return (int) $item->course_user_id === (int) $enrollmentId || $item->course_user_id === null;
                }
                return true;
            });

            $courseAttempts = $allAttempts->filter(function ($item) use ($enrollmentId) {
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

            $progressByModule = $courseProgress->keyBy('module_id');
            $attemptsByModule = $courseAttempts->groupBy('module_id');

            $evaluatedScores = [];

            $modulesList = $course->modules->map(function ($module) use ($progressByModule, $attemptsByModule, &$evaluatedScores) {
                $progress = $progressByModule->get($module->id);
                $attempts = $attemptsByModule->get($module->id, collect());
                $attemptsCount = $attempts->count();

                $bestAttemptScore = $attempts->max('score');
                $latestAttemptScore = $attempts->first()?->score;

                // Priorizamos exam_score de progreso si existe; si no, la mejor nota de intentos
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
                    'completed' => $isCompleted,
                    'status' => $hasScore ? 'Calificado' : ($isCompleted ? 'Completado sin nota' : 'Pendiente'),
                ];
            })->values();

            $totalModulesCount = $modulesList->count();
            $evaluatedModulesCount = count($evaluatedScores);
            $courseAverage = $evaluatedModulesCount > 0
                ? round(array_sum($evaluatedScores) / $evaluatedModulesCount, 2)
                : null;

            return [
                'id' => $course->id,
                'title' => $course->title,
                'description' => $course->description,
                'image' => $course->image,
                'course_score' => $courseAverage,
                'evaluated_modules_count' => $evaluatedModulesCount,
                'total_modules_count' => $totalModulesCount,
                'modules' => $modulesList,
            ];
        })->values();

        return Inertia::render('Student/Grades', [
            'grades' => $gradesData,
        ]);
    }
}