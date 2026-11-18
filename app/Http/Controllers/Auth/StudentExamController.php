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

        // Contar cuántos intentos previos registra el estudiante en este módulo
        $attemptsCount = StudentModuleProgress::where('user_id', $userId)
            ->where('module_id', $moduleId)
            ->count();

        // Permitir máximo 3 intentos
        if ($attemptsCount >= 3) {
            return redirect()->route('student.courses.show', $courseId)
                ->withErrors(['error' => 'Has agotado el límite máximo de 3 intentos permitidos para esta evaluación.']);
        }

        // Buscar el módulo con sus exámenes y opciones
        $module = Module::with(['exams.options'])->findOrFail($moduleId);

        // Validar fechas de la evaluación del módulo (si están definidas)
        $now = Carbon::now();
        if ($module->exam_start_date && $now->lt(Carbon::parse($module->exam_start_date)->startOfDay())) {
            return redirect()->route('student.courses.show', $courseId)
                ->withErrors(['error' => 'La evaluación de este módulo aún no ha comenzado.']);
        }

        if ($module->exam_end_date && $now->gt(Carbon::parse($module->exam_end_date)->endOfDay())) {
            return redirect()->route('student.courses.show', $courseId)
                ->withErrors(['error' => 'El período de evaluación para este módulo ha finalizado.']);
        }

        // Barajar preguntas y opciones asegurando arreglos limpios con ->values()
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
     * Procesa las respuestas del examen, calcula la nota de 0 a 20 y guarda el nuevo intento.
     */
    public function submitExam(Request $request, $courseId, $moduleId)
    {
        $userId = auth()->id();

        // Verificar nuevamente los intentos antes de guardar
        $attemptsCount = StudentModuleProgress::where('user_id', $userId)
            ->where('module_id', $moduleId)
            ->count();

        if ($attemptsCount >= 3) {
            return redirect()->route('student.courses.show', $courseId)
                ->withErrors(['error' => 'Ya has alcanzado el límite de 3 intentos para este examen.']);
        }

        $answers = $request->input('answers', []); // [examId => optionId]
        $module = Module::with('exams.options')->findOrFail($moduleId);

        $totalQuestions = count($module->exams);
        $correctAnswers = 0;

        foreach ($module->exams as $exam) {
            $selectedOptionId = $answers[$exam->id] ?? null;

            if ($selectedOptionId) {
                // Verificar si la opción seleccionada es la correcta
                $correctOption = collect($exam->options)->where('is_correct', true)->first();

                if ($correctOption && $correctOption->id == $selectedOptionId) {
                    $correctAnswers++;
                }
            }
        }

        // Calcular la nota en base a una escala de 0 a 20 de forma proporcional
        $score = $totalQuestions > 0 ? ($correctAnswers / $totalQuestions) * 20 : 0;

        /*
        | -----------------------------------------------------------------
        | NOTA: Como la tabla tiene un índice único por user_id y module_id,
        | usamos updateOrCreate para actualizar el progreso del módulo con 
        | la nota obtenida en este intento.
        | -----------------------------------------------------------------
        */
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