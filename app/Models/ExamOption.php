<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamOption extends Model
{
    protected $table = 'exam_options';

    protected $fillable = [
        'module_exam_id', // O cámbialo si tu columna se llama distinto en MySQL (ej. 'exam_id' o 'question_id')
        'text',
        'is_correct',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    // Relación: Una opción pertenece a una pregunta (ModuleExam)
    public function exam(): BelongsTo
    {
        // Asegúrate de pasar el segundo parámetro con el nombre exacto de la columna en tu tabla 'exam_options'
        return $this->belongsTo(ModuleExam::class, 'module_exam_id');
    }
}