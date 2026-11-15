<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
    /**
     * Muestra la lista de cursos con sus módulos, contenidos y exámenes.
     */
    public function index()
    {
        $courses = Course::with(['modules.contents', 'modules.exams'])->latest()->get();
        return response()->json($courses);
    }

    /**
     * Almacena un nuevo curso completo con módulos, contenidos y evaluaciones.
     */
    public function store(Request $request)
    {
        // 1. Validar la estructura general recibida desde el frontend
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',
            'modules' => 'required|array|min:1',
            'modules.*.title' => 'required|string|max:255',
            'modules.*.contents' => 'nullable|array',
            'modules.*.contents.*.title' => 'required_with:modules.*.contents|string|max:255',
            'modules.*.contents.*.type' => 'required_with:modules.*.contents|in:pdf,video',
            'modules.*.exams' => 'nullable|array',
            'modules.*.exams.*.question' => 'required_with:modules.*.exams|string',
            'modules.*.exams.*.options' => 'required_with:modules.*.exams|array|min:4',
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

            // Crear el Curso principal
            $course = Course::create([
                'title' => $request->input('title'),
                'description' => $request->input('description'),
                'image' => $imagePath,
            ]);

            // Recorrer y guardar cada Módulo
            foreach ($request->input('modules', []) as $modIndex => $modData) {
                $module = $course->modules()->create([
                    'title' => $modData['title'],
                    'order' => $modIndex + 1,
                ]);

                // Guardar Contenidos (PDFs o Videos) del módulo
                if (!empty($modData['contents'])) {
                    foreach ($modData['contents'] as $contIndex => $contData) {
                        $filePath = null;
                        $fileKey = "modules.{$modIndex}.contents.{$contIndex}.file";

                        if ($request->hasFile($fileKey)) {
                            $folder = $contData['type'] === 'pdf' ? 'courses/pdfs' : 'courses/videos';
                            $filePath = $request->file($fileKey)->store($folder, 'public');
                        }

                        $module->contents()->create([
                            'title' => $contData['title'],
                            'type' => $contData['type'],
                            'file_path' => $filePath,
                            'url' => $contData['url'] ?? null,
                            'order' => $contIndex + 1,
                        ]);
                    }
                }

                // Guardar Evaluaciones (Preguntas y opciones) del módulo
                if (!empty($modData['exams'])) {
                    foreach ($modData['exams'] as $examData) {
                        // Limpiar y estructurar las opciones en formato JSON
                        $options = collect($examData['options'])->map(function ($opt) {
                            return [
                                'text' => $opt['text'],
                                'is_correct' => filter_var($opt['is_correct'] ?? false, FILTER_VALIDATE_BOOLEAN),
                            ];
                        })->values()->all();

                        $module->exams()->create([
                            'question' => $examData['question'],
                            'options' => $options,
                        ]);
                    }
                }
            }

            // Confirmar transacción si todo salió bien
            DB::commit();

            return response()->json([
                'message' => '¡Curso creado correctamente con todos sus módulos y evaluaciones!',
                'course' => $course->load(['modules.contents', 'modules.exams']),
            ], 201);

        } catch (\Exception $e) {
            // Revertir cambios si ocurre algún error
            DB::rollBack();
            return response()->json([
                'message' => 'Error interno al guardar el curso.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}