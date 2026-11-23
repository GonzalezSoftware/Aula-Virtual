<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\ModuleContent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;

class StudentContentController extends Controller
{
    public function viewPdf(Request $request, $contentId)
    {
        $content = ModuleContent::findOrFail($contentId);
        $relativePath = $content->file_path ?? $content->file ?? $content->path ?? $content->file_url;

        if (!$relativePath) {
            abort(404, 'Archivo PDF no encontrado.');
        }

        $cleanPath = ltrim(preg_replace('#^/?storage/#', '', $relativePath), '/');
        $pdfPath = Storage::disk('public')->exists($cleanPath)
            ? Storage::disk('public')->path($cleanPath)
            : Storage::path($cleanPath);

        if (!file_exists($pdfPath)) {
            abort(404, 'El archivo PDF no existe en el servidor.');
        }

        return response()->file($pdfPath, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="documento.pdf"',
        ]);
    }

    public function renderPage(Request $request, $contentId, int $page)
    {
        $content = ModuleContent::findOrFail($contentId);

        $relativePath = $content->file_path ?? $content->file ?? $content->path ?? $content->file_url;

        if (!$relativePath) {
            abort(404, 'Archivo PDF no encontrado.');
        }

        // Resuelve ruta local ya sea en storage/app/public o storage/app
        $cleanPath = ltrim(preg_replace('#^/?storage/#', '', $relativePath), '/');
        $pdfPath = Storage::disk('public')->exists($cleanPath)
            ? Storage::disk('public')->path($cleanPath)
            : Storage::path($cleanPath);

        if (!file_exists($pdfPath)) {
            abort(404, 'El archivo PDF no existe en el servidor.');
        }

        // Obtener número total de páginas con pdfinfo
        $infoProcess = new Process(['pdfinfo', $pdfPath]);
        $infoProcess->run();

        $totalPages = 1;
        if ($infoProcess->isSuccessful() && preg_match('/Pages:\s+(\d+)/', $infoProcess->getOutput(), $matches)) {
            $totalPages = max(1, (int) $matches[1]);
        }

        $targetPage = max(1, min($page, $totalPages));

        // Cachear la imagen renderizada en storage/framework/cache/pdf-pages
        $cacheDir = storage_path("framework/cache/pdf-pages/{$content->id}");
        if (!is_dir($cacheDir)) {
            mkdir($cacheDir, 0755, true);
        }

        $prefix = "{$cacheDir}/page-{$targetPage}";
        $expectedPng = "{$prefix}-{$targetPage}.png";

        if (!file_exists($expectedPng)) {
            $existing = glob("{$prefix}*.png");
            if (!empty($existing)) {
                $expectedPng = $existing[0];
            } else {
                $renderProcess = new Process([
                    'pdftoppm',
                    '-png',
                    '-r', '140',
                    '-f', (string) $targetPage,
                    '-l', (string) $targetPage,
                    $pdfPath,
                    $prefix,
                ]);
                $renderProcess->run();

                if (!$renderProcess->isSuccessful()) {
                    abort(500, 'No se pudo convertir la página del PDF a imagen.');
                }

                $generated = glob("{$prefix}*.png");
                if (empty($generated)) {
                    abort(500, 'No se generó la imagen de la página.');
                }
                $expectedPng = $generated[0];
            }
        }

        return response()->file($expectedPng, [
            'Content-Type' => 'image/png',
            'Content-Disposition' => 'inline; filename="pagina-' . $targetPage . '.png"',
            'X-Total-Pages' => (string) $totalPages,
        ]);
    }
}