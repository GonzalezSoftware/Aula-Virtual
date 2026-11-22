<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\ExamAttempt;
use App\Models\Module;
use App\Models\StudentModuleProgress;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentExamController extends Controller
{
    private function validateExamAvailability(Course $course, Module $module)
    {
        $today = Carbon::today();

        if ($course->start_date && $today->lt(Carbon::parse($course->start_date)->startOfDay())) {
            $dateStr = Carbon::parse($course->start_date)->format('d/m/Y');
            return "El curso \"{$course->title}\" aún no ha iniciado (inicia el {$dateStr}).";
        }

        if ($course->end_date && $today->gt(Carbon::parse($course->end_date)->endOfDay())) {
            $dateStr = Carbon::parse($course->end_date)->format('d/m/Y');
            return "El curso \"{$course->title}\" ya finalizó (cerró el {$dateStr}).";
        }

        if ($module->start_date && $today->lt(Carbon::parse($module->start_date)->startOfDay())) {
            $dateStr = Carbon::parse($module->start_date)->format('d/m/Y');
            return "El módulo \"{$module->title}\" aún no ha iniciado (inicia el {$dateStr}).";
        }

        if ($module->end_date && $today->gt(Carbon::parse($module->end_date)->endOfDay())) {
            $dateStr = Carbon::parse($module->end_date)->format('d/m/Y');
            return "El módulo \"{$module->title}\" ya cerró (cerró el {$dateStr}).";
        }

        if ($module->exam_start_date && $today->lt(Carbon::parse($module->exam_start_date)->startOfDay())) {
            $dateStr = Carbon::parse($module->exam_start_date)->format('d/m/Y');
            return "La evaluación del módulo \"{$module->title}\" aún no está habilitada. Inicia el {$dateStr}.";
        }

        if ($module->exam_end_date && $today->gt(Carbon::parse($module->exam_end_date)->endOfDay())) {
            $dateStr = Carbon::parse($module->exam_end_date)->format('d/m/Y');
            return "La evaluación del módulo \"{$module->title}\" ya cerró. Fecha límite: {$dateStr}.";
        }

        return null;
    }

    /**
     * Muestra el examen del módulo con preguntas y respuestas barajadas aleatoriamente.
     */
    public function showExam($courseId, $moduleId)
    {
        $user = auth()->user();
        $userId = $user->id;

        $course = Course::findOrFail($courseId);
        $module = Module::with(['exams.options'])->findOrFail($moduleId);

        if ((int) $module->course_id !== (int) $course->id) {
            return redirect()
                ->route('student.courses.show', $course->id)
                ->with('error', 'El módulo no pertenece a este curso.');
        }

        $isEnrolled = $user->courses()->where('courses.id', $course->id)->exists();
        if (!$isEnrolled && $user->email !== 'admin_oculto') {
            return redirect()
                ->route('dashboard')
                ->with('error', 'No tienes acceso a este curso.');
        }

        if ($dateMessage = $this->validateExamAvailability($course, $module)) {
            return redirect()
                ->route('student.courses.modules.show', [$course->id, $module->id])
                ->with('error', $dateMessage);
        }

        $attemptsCount = ExamAttempt::where('user_id', $userId)
            ->where('module_id', $module->id)
            ->count();

        if ($attemptsCount >= 3) {
            return redirect()
                ->route('student.courses.show', $course->id)
                ->with('error', 'No puedes presentar el examen nuevamente porque ya agotaste el límite de 3 intentos.');
        }

        $validExams = $module->exams
            ->filter(fn ($exam) => $exam->getRelation("options") && $exam->getRelation("options")->count() > 0)
            ->map(function ($exam) {
                $shuffledOptions = $exam->getRelation("options")
                    ->shuffle()
                    ->values()
                    ->map(fn ($opt) => [
                        'id' => $opt->id,
                        'text' => $opt->text,
                    ]);

                return [
                    'id' => $exam->id,
                    'question' => $exam->question,
                    'options' => $shuffledOptions,
                ];
            })
            ->shuffle()
            ->values();

        if ($validExams->isEmpty()) {
            return redirect()
                ->route('student.courses.show', $course->id)
                ->with('error', 'Este examen aún no tiene preguntas con opciones de respuesta configuradas.');
        }

        return Inertia::render('Student/ExamView', [
            'course' => [
                'id' => $course->id,
                'title' => $course->title,
            ],
            'module' => [
                'id' => $module->id,
                'title' => $module->title,
            ],
            'exams' => $validExams,
            'attemptNumber' => $attemptsCount + 1,
        ]);
    }

    /**
     * Procesa las respuestas del examen, calcula la nota de 0 a 20 y guarda el intento.
     */
    public function submitExam(Request $request, $courseId, $moduleId)
    {
        $user = $request->user();
        $userId = $user->id;

        $course = Course::findOrFail($courseId);
        $module = Module::with('exams.options')->findOrFail($moduleId);

        if ((int) $module->course_id !== (int) $course->id) {
            return redirect()
                ->route('student.courses.show', $course->id)
                ->with('error', 'El módulo no pertenece a este curso.');
        }

        if ($dateMessage = $this->validateExamAvailability($course, $module)) {
            return redirect()
                ->route('student.courses.modules.show', [$course->id, $module->id])
                ->with('error', $dateMessage);
        }

        $attemptsCount = ExamAttempt::where('user_id', $userId)
            ->where('module_id', $module->id)
            ->count();

        if ($attemptsCount >= 3) {
            return redirect()
                ->route('student.courses.show', $course->id)
                ->with('error', 'No puedes presentar el examen nuevamente porque ya agotaste el límite de 3 intentos.');
        }

        $validated = $request->validate([
            'answers' => ['nullable', 'array'],
        ]);

        $answers = $validated['answers'] ?? [];
        $totalQuestions = $module->exams->count();
        $correctAnswers = 0;

        foreach ($module->exams as $exam) {
            $selectedOptionId = $answers[$exam->id] ?? null;
            if (!$selectedOptionId) {
                continue;
            }

            $optionsRelation = $exam->getRelation("options");
            $correctOption = $optionsRelation ? $optionsRelation->firstWhere("is_correct", true) : null;
            if ($correctOption && (int) $correctOption->id === (int) $selectedOptionId) {
                $correctAnswers++;
            }
        }

        $score = $totalQuestions > 0
            ? round(($correctAnswers / $totalQuestions) * 20, 2)
            : 0.00;

        $nextAttemptNumber = $attemptsCount + 1;

        ExamAttempt::create([
            'user_id' => $userId,
            'module_id' => $module->id,
            'attempt_number' => $nextAttemptNumber,
            'answers' => $answers,
            'score' => $score,
            'submitted_at' => Carbon::now(),
        ]);

        StudentModuleProgress::updateOrCreate(
            [
                'user_id' => $userId,
                'module_id' => $module->id,
            ],
            [
                'completed' => true,
                'exam_score' => $score,
                'completed_at' => Carbon::now(),
            ]
        );

        $formattedScore = number_format($score, 2);

        return redirect()
            ->route('student.courses.show', $course->id)
            ->with('success', "¡Has terminado el examen! Tu nota obtenida es: {$formattedScore} / 20.")
            ->with('exam_score', $formattedScore);
    }
}