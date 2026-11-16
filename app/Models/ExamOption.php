<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamOption extends Model
{
    protected $fillable = [
        'module_exam_id',
        'text',
        'is_correct',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    // Relación: Una opción de respuesta pertenece a una pregunta (evaluación)
    public function exam(): BelongsTo
    {
        return $this->belongsTo(ModuleExam::class, 'module_exam_id');
    }
}