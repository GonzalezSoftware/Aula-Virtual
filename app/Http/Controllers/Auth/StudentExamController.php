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
    /**
     * Muestra el examen del módulo con preguntas y respuestas barajadas aleatoriamente.
     */
    public function showExam($courseId, $moduleId)
    {
        $user = auth()->user();
        $userId = $user->id;

        $course = Course::findOrFail($courseId);
        $module = Module::with(['exams.options'])->findOrFail($moduleId);

        // Verificar que el módulo pertenezca al curso solicitado
        if ((int) $module->course_id !== (int) $course->id) {
            return redirect()
                ->route('student.courses.show', $course->id)
                ->withErrors(['error' => 'El módulo no pertenece a este curso.']);
        }

        // Verificar inscripción del estudiante (o admin_oculto para pruebas)
        $isEnrolled = $user->courses()->where('courses.id', $course->id)->exists();
        if (!$isEnrolled && $user->email !== 'admin_oculto') {
            return redirect()
                ->route('dashboard')
                ->withErrors(['error' => 'No tienes acceso a este curso.']);
        }

        // Contar intentos reales en exam_attempts (máximo 3)
        $attemptsCount = ExamAttempt::where('user_id', $userId)
            ->where('module_id', $module->id)
            ->count();

        if ($attemptsCount >= 3) {
            return redirect()
                ->route('student.courses.show', $course->id)
                ->withErrors(['error' => 'Has agotado el límite máximo de 3 intentos permitidos para esta evaluación.']);
        }

        // Filtrar preguntas que tengan opciones válidas y barajar opciones y preguntas
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
                ->withErrors(['error' => 'Este examen aún no tiene preguntas con opciones de respuesta configuradas.']);
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
                ->withErrors(['error' => 'El módulo no pertenece a este curso.']);
        }

        $attemptsCount = ExamAttempt::where('user_id', $userId)
            ->where('module_id', $module->id)
            ->count();

        if ($attemptsCount >= 3) {
            return redirect()
                ->route('student.courses.show', $course->id)
                ->withErrors(['error' => 'Ya has alcanzado el límite de 3 intentos para este examen.']);
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

        return redirect()
            ->route('student.courses.show', $course->id)
            ->with('success', '¡Evaluación enviada con éxito! Tu nota final es: ' . number_format($score, 2) . '/20');
    }
}
