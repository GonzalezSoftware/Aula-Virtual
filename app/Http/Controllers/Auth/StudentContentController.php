<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Content; // O el modelo donde almacenas los contenidos/archivos del módulo
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StudentContentController extends Controller
{
    public function viewPdf($contentId)
    {
        // 1. Buscar el contenido en la base de datos
        $content = Content::findOrFail($contentId);
        
        // 2. Obtener la ruta física del archivo en storage/app/public/...
        // (Asegúrate de que $content->file_path corresponda a la columna que guarda la ruta del archivo)
        $path = storage_path('app/public/' . $content->file_path);

        // 3. Validar si el archivo realmente existe en el servidor
        if (!file_exists($path)) {
            abort(404, 'El archivo PDF no fue encontrado en el servidor.');
        }

        // 4. Retornar el archivo con el encabezado 'inline' para forzar la visualización en lugar de descarga
        return response()->file($path, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="documento-protegido.pdf"'
        ]);
    }
}