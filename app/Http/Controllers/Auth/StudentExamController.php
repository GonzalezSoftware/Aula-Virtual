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

        // Verificar si el estudiante ya completó este módulo
        $progress = StudentModuleProgress::where('user_id', $userId)
            ->where('module_id', $moduleId)
            ->first();

        if ($progress && $progress->completed) {
            return redirect()->route('student.courses.show', $courseId)
                ->withErrors(['error' => 'Ya has completado este módulo y su evaluación previamente.']);
        }

        // Buscar el módulo con sus exámenes y opciones
        $module = Module::with(['exams.options'])->findOrFail($moduleId);

        // Validar fechas de la evaluación del módulo
        $now = Carbon::now();
        if ($module->exam_start_date && $now->lt(Carbon::parse($module->exam_start_date)->startOfDay())) {
            return redirect()->route('student.courses.show', $courseId)
                ->withErrors(['error' => 'La evaluación de este módulo aún no ha comenzado.']);
        }

        if ($module->exam_end_date && $now->gt(Carbon::parse($module->exam_end_date)->endOfDay())) {
            return redirect()->route('student.courses.show', $courseId)
                ->withErrors(['error' => 'El período de evaluación para este módulo ha finalizado y se encuentra cerrado.']);
        }

        // 🛡️ Solución: Convertimos explícitamente a colección de Laravel con collect() para evitar errores de tipo string/relación
        $exams = collect($module->exams)->shuffle()->map(function ($exam) {
            $exam->setRelation('options', collect($exam->options)->shuffle());
            return $exam;
        });

        return Inertia::render('Student/ExamView', [
            'courseId' => $courseId,
            'module' => $module,
            'exams' => $exams,
        ]);
    }

    /**
     * Procesa las respuestas del examen, calcula la nota y guarda el progreso.
     */
    public function submitExam(Request $request, $courseId, $moduleId)
    {
        $userId = auth()->id();

        // Doble validación por seguridad para evitar envíos duplicados
        $progress = StudentModuleProgress::where('user_id', $userId)
            ->where('module_id', $moduleId)
            ->first();

        if ($progress && $progress->completed) {
            return redirect()->route('student.courses.show', $courseId)
                ->withErrors(['error' => 'Esta evaluación ya fue registrada anteriormente.']);
        }

        $answers = $request->input('answers', []); // Recibe un array asociativo: [examId => optionId]
        $module = Module::with('exams.options')->findOrFail($moduleId);

        $totalQuestions = count($module->exams);
        $correctAnswers = 0;

        foreach ($module->exams as $exam) {
            $selectedOptionId = $answers[$exam->id] ?? null;

            if ($selectedOptionId) {
                // Buscar cuál es la opción correcta de esta pregunta asegurando colección
                $correctOption = collect($exam->options)->where('is_correct', true)->first();

                if ($correctOption && $correctOption->id == $selectedOptionId) {
                    $correctAnswers++;
                }
            }
        }

        // Calcular la nota en base a una escala de 0 a 20
        $score = $totalQuestions > 0 ? ($correctAnswers / $totalQuestions) * 20 : 0;

        // Guardar el registro en la tabla de notas e historial de avance
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
            ->with('success', '¡Evaluación completada con éxito! Tu nota final es: ' . number_format($score, 2) . '/20');
    }
}