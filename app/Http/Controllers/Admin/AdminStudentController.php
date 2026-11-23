<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminStudentController extends Controller
{
    /**
     * Listado general de estudiantes aprobados o activos.
     */
    public function index()
    {
        $students = User::with('courses')->where('en_espera', 0)->get();
        $courses = Course::all(); // Todos los cursos creados

        return Inertia::render('Admin/Students', [
            'students' => $students,
            'courses' => $courses
        ]);
    }

    // Método para asignar o actualizar los cursos de un estudiante sin afectar cursos terminados ni notas
    public function assignCourses(Request $request, $id)
    {
        $student = User::findOrFail($id);

        $selectedCourseIds = collect($request->input('courses', []))
            ->map(fn ($courseId) => (int) $courseId)
            ->unique()
            ->values();

        $existingEnrollments = $student->courses()->get()->keyBy('id');

        // 1. Preservar siempre los cursos ya completados para proteger su historial y calificaciones
        $completedCourseIds = $existingEnrollments
            ->filter(fn ($course) => ($course->pivot?->status ?? null) === 'completed')
            ->keys();

        $finalCourseIds = $selectedCourseIds->merge($completedCourseIds)->unique()->values();

        // 2. Consultar cursos para registrar snapshot de fechas en inscripciones nuevas o activas
        $coursesMap = Course::whereIn('id', $finalCourseIds)->get()->keyBy('id');

        foreach ($finalCourseIds as $courseId) {
            $courseModel = $coursesMap->get($courseId);
            if (!$courseModel) {
                continue;
            }

            $existing = $existingEnrollments->get($courseId);

            if (!$existing) {
                $student->courses()->attach($courseId, [
                    'enrolled_start_date' => $courseModel->start_date,
                    'enrolled_end_date' => $courseModel->end_date,
                    'status' => 'active',
                    'completed_at' => null,
                ]);
            } elseif (($existing->pivot?->status ?? null) !== 'completed') {
                $student->courses()->updateExistingPivot($courseId, [
                    'enrolled_start_date' => $existing->pivot?->enrolled_start_date ?? $courseModel->start_date,
                    'enrolled_end_date' => $existing->pivot?->enrolled_end_date ?? $courseModel->end_date,
                    'status' => 'active',
                ]);
            }
        }

        // 3. Desvincular únicamente inscripciones no completadas que fueron desmarcadas por el admin
        $coursesToDetach = $existingEnrollments
            ->filter(function ($course) use ($finalCourseIds) {
                $isCompleted = ($course->pivot?->status ?? null) === 'completed';
                return !$isCompleted && !$finalCourseIds->contains((int) $course->id);
            })
            ->keys()
            ->all();

        if (!empty($coursesToDetach)) {
            $student->courses()->detach($coursesToDetach);
        }

        return back()->with('success', 'Cursos asignados correctamente.');
    }

    /**
     * Listado específico para estudiantes en espera (en_espera === 1).
     */
    public function pending(): Response
    {
        $students = User::where('email', '!=', 'admin_oculto')->get();

        return Inertia::render('Admin/PendingStudents', [
            'students' => $students,
        ]);
    }

    /**
     * Aprobar estudiante, generar clave temporal de 8 dígitos, hashearla y enviarla por correo.
     */
    public function approve($id)
    {
        $student = User::findOrFail($id);

        // 1. Generar clave temporal aleatoria de 8 caracteres
        $temporaryPassword = Str::random(8);

        // 2. Actualizar el estado y guardar la contraseña encriptada
        $student->update([
            'en_espera' => 0,
            'password' => Hash::make($temporaryPassword),
        ]);

        // 3. Enviar el correo electrónico con la misma interfaz limpia y minimalista
        $subject = '¡Cuenta Aprobada - Clave Temporal de Acceso!';

        Mail::send([], [], function ($message) use ($student, $temporaryPassword, $subject) {
            $message->to($student->email)
                    ->subject($subject)
                    ->html('
                        <div style="font-family: \'Poppins\', Arial, sans-serif; background-color: #F8FAFC; padding: 50px 20px; color: #0A2540; text-align: center;">
                            <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 28px; border: 1px solid #E2E8F0; padding: 45px 35px; box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.04);">
                                
                                <h2 style="color: #051C33; margin-top: 0; margin-bottom: 25px; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
                                    Cuenta Aprobada
                                </h2>
                                
                                <p style="color: #4A607A; font-size: 15px; line-height: 1.6; margin-bottom: 35px; text-align: center;">
                                    Tu solicitud ha sido aprobada en el Aula Virtual Académica. Utiliza la siguiente clave temporal de 8 dígitos para iniciar sesión:
                                </p>
                                
                                <div style="background-color: #EBF5FF; border-radius: 20px; padding: 25px; margin-bottom: 30px; text-align: center;">
                                    <span style="font-size: 32px; font-weight: 800; color: #0066FF; letter-spacing: 6px;">' . $temporaryPassword . '</span>
                                </div>

                                <p style="color: #94A3B8; font-size: 13px; line-height: 1.5; margin: 0; text-align: center;">
                                    Te recomendamos cambiar tu contraseña una vez que ingreses a la plataforma.
                                </p>
                            </div>
                        </div>
                    ');
        });

        return back()->with('success', 'Estudiante aprobado y contraseña temporal enviada por correo.');
    }

    /**
     * Rechazar / Eliminar estudiante en espera y su archivo de cédula.
     */
    public function reject($id)
    {
        $student = User::findOrFail($id);

        if ($student->cedula_image && Storage::disk('public')->exists($student->cedula_image)) {
            Storage::disk('public')->delete($student->cedula_image);
        }

        $student->delete();

        return back()->with('success', 'Solicitud rechazada y registro eliminado.');
    }
}