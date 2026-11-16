<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\ModuleContent; // ⚠️ Cambia 'Content' por el nombre real de tu modelo (ej. ModuleContent)
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StudentContentController extends Controller
{
    public function viewPdf($contentId)
    {
        // 1. Buscar el contenido usando el modelo correcto
        $content = ModuleContent::findOrFail($contentId);
        
        // 2. Obtener la ruta física del archivo (ajusta la propiedad según tu columna en BD, ej: file_path o path)
        $path = storage_path('app/public/' . $content->file_path);

        // 3. Validar si el archivo existe
        if (!file_exists($path)) {
            abort(404, 'El archivo PDF no fue encontrado en el servidor.');
        }

        // 4. Retornar el PDF en modo visualización protegida 'inline'
        return response()->file($path, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="documento-protegido.pdf"'
        ]);
    }
}