<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class CourseController extends Controller
{
    /**
     * Muestra la lista de cursos con sus módulos, contenidos y exámenes.
     */
    public function index()
    {
        $courses = Course::with(['modules.contents', 'modules.exams.options'])->latest()->get();
        return response()->json($courses);
    }

    /**
     * Almacena un nuevo curso completo con módulos, contenidos y evaluaciones (con fechas).
     */
    public function store(Request $request)
    {
        // 1. Validar la estructura general recibida desde el frontend
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',
            'modules' => 'required|array|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 2. Iniciar transacción de base de datos
        DB::beginTransaction();
        try {
            // Guardar imagen de portada si existe
            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('courses/images', 'public');
            }

            // Crear el Curso principal con sus fechas de inicio y culminación
            $course = Course::create([
                'title' => $request->input('title'),
                'description' => $request->input('description'),
                'start_date' => $request->input('start_date'),
                'end_date' => $request->input('end_date'),
                'image' => $imagePath,
            ]);

            $modulesData = $request->input('modules', []);

            // Recorrer y guardar cada Módulo con sus respectivas fechas y validación de nulos
            foreach ($modulesData as $modIndex => $modData) {
                $module = $course->modules()->create([
                    'title' => $modData['title'] ?? 'Módulo sin título',
                    'start_date' => !empty($modData['start_date']) ? $modData['start_date'] : null,
                    'end_date' => !empty($modData['end_date']) ? $modData['end_date'] : null,
                    'exam_start_date' => !empty($modData['exam_start_date']) ? $modData['exam_start_date'] : null,
                    'exam_end_date' => !empty($modData['exam_end_date']) ? $modData['exam_end_date'] : null,
                    'order' => $modIndex + 1,
                ]);

                // Guardar Contenidos (PDFs o Videos) del módulo
                if (!empty($modData['contents']) && is_array($modData['contents'])) {
                    foreach ($modData['contents'] as $contIndex => $contData) {
                        $filePath = null;
                        $fileKey = "modules.{$modIndex}.contents.{$contIndex}.file";

                        if ($request->hasFile($fileKey)) {
                            $folder = ($contData['type'] ?? '') === 'pdf' ? 'courses/pdfs' : 'courses/videos';
                            $filePath = $request->file($fileKey)->store($folder, 'public');
                        }

                        $module->contents()->create([
                            'title' => $contData['title'] ?? 'Sin título',
                            'type' => $contData['type'] ?? 'video',
                            'file_path' => $filePath,
                            'url' => $contData['url'] ?? null,
                            'order' => $contIndex + 1,
                        ]);
                    }
                }

// Guardar Evaluaciones (Preguntas y opciones) del módulo
if (!empty($modData['exams']) && is_array($modData['exams'])) {
    foreach ($modData['exams'] as $examData) {
        $exam = $module->exams()->create([
            'question' => $examData['question'] ?? 'Pregunta sin texto',
        ]);

        if (!empty($examData['options']) && is_array($examData['options'])) {
            foreach ($examData['options'] as $optData) {
                // Aseguramos que is_correct se evalúe correctamente como booleano (1 o 0)
                $isCorrect = isset($optData['is_correct']) && ($optData['is_correct'] == '1' || $optData['is_correct'] === true);
                
                $exam->options()->create([
                    'text' => $optData['text'] ?? '',
                    'is_correct' => $isCorrect,
                ]);
            }
        }
    }
}
            }

            // Confirmar transacción si todo salió bien
            DB::commit();

            return response()->json([
                'message' => '¡Curso creado correctamente con todos sus módulos, fechas y evaluaciones!',
                'course' => $course->load(['modules.contents', 'modules.exams.options']),
            ], 201);

} catch (\Exception $e) {
            // Revertir cambios si ocurre algún error
            DB::rollBack();
            return response()->json([
                'message' => 'Error interno detallado',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ], 500);
        }
    }

    // Muestra la vista para gestionar y eliminar cursos
    public function manage()
    {
        $courses = Course::latest()->get();

        return Inertia::render('Admin/ManageCourses', [
            'courses' => $courses
        ]);
    }

    // Elimina el curso de la base de datos
    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        
        $course->delete();

        return redirect()->route('admin.courses.manage')->with('status', '¡Curso eliminado con éxito!');
    }
}