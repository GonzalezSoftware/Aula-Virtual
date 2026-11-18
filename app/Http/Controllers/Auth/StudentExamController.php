<?php

namespace App\Http\Controllers\Auth;

use App\Models\Module;
use App\Models\StudentModuleProgress;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class StudentExamController extends Controller
{
    /**
     * Muestra el examen del módulo con preguntas y respuestas barajadas aleatoriamente.
     */
     public function showExam($courseId, $moduleId)
    {
        $userId = auth()->id();

        $attemptsCount = StudentModuleProgress::where('user_id', $userId)
            ->where('module_id', $moduleId)
            ->count();

        if ($attemptsCount >= 3) {
            return redirect()->route('student.courses.show', $courseId)
                ->withErrors(['error' => 'Has agotado el límite máximo de 3 intentos permitidos para esta evaluación.']);
        }

        $module = Module::with(['exams.options'])->findOrFail($moduleId);

        $now = Carbon::now();
        if ($module->exam_start_date && $now->lt(Carbon::parse($module->exam_start_date)->startOfDay())) {
            return redirect()->route('student.courses.show', $courseId)
                ->withErrors(['error' => 'La evaluación de este módulo aún no ha comenzado.']);
        }

        if ($module->exam_end_date && $now->gt(Carbon::parse($module->exam_end_date)->endOfDay())) {
            return redirect()->route('student.courses.show', $courseId)
                ->withErrors(['error' => 'El período de evaluación para este módulo ha finalizado.']);
        }

        // Transformación limpia con ->values() para garantizar arreglos en JSON
        $exams = collect($module->exams)->shuffle()->map(function ($exam) {
            $shuffledOptions = collect($exam->options)->shuffle()->values();
            $exam->setRelation('options', $shuffledOptions);
            return $exam;
        })->values();

        return Inertia::render('Student/ExamView', [
            'courseId' => $courseId,
            'module' => $module,
            'exams' => $exams,
            'attemptNumber' => $attemptsCount + 1,
        ]);
    }

    /**
     * Procesa las respuestas del examen, calcula la nota de 0 a 20 y guarda el registro.
     */
    public function submitExam(Request $request, $courseId, $moduleId)
    {
        $userId = auth()->id();

        // Buscar si ya existe un registro de progreso/examen para este usuario y módulo
        $progress = StudentModuleProgress::where('user_id', $userId)
            ->where('module_id', $moduleId)
            ->first();

        // Si ya existe, podemos verificar cuántos intentos llevaba (si guardas un contador) 
        // o actualizar su nota si este nuevo intento es mejor, o bien usar updateOrCreate.
        // Dado que la tabla exige unicidad por usuario y módulo, utilizaremos updateOrCreate:

        $answers = $request->input('answers', []); 
        $module = Module::with('exams.options')->findOrFail($moduleId);

        $totalQuestions = count($module->exams);
        $correctAnswers = 0;

        foreach ($module->exams as $exam) {
            $selectedOptionId = $answers[$exam->id] ?? null;

            if ($selectedOptionId) {
                $correctOption = collect($exam->options)->where('is_correct', true)->first();

                if ($correctOption && $correctOption->id == $selectedOptionId) {
                    $correctAnswers++;
                }
            }
        }

        // Calcular la nota en escala de 0 a 20
        $score = $totalQuestions > 0 ? ($correctAnswers / $totalQuestions) * 20 : 0;

        // Usamos updateOrCreate para actualizar el registro existente del módulo en lugar de duplicarlo
        StudentModuleProgress::updateOrCreate(
            [
                'user_id' => $userId,
                'module_id' => $moduleId,
            ],
            [
                'completed' => true,
                'exam_score' => round($score, 2),
                'completed_at' => Carbon::now(),
            ]
        );

        return redirect()->route('student.courses.show', $courseId)
            ->with('success', '¡Evaluación enviada con éxito! Tu nota final es: ' . number_format($score, 2) . '/20');
    }
}