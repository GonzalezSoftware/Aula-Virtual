<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamOption extends Model
{
    protected $table = 'exam_options';

    protected $fillable = [
        'module_exam_id', 
        'text',
        'is_correct',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    // Relación: Una opción pertenece a una pregunta (ModuleExam)
    public function exam(): BelongsTo
    {
        // Primer parámetro: Modelo relacionado
        // Segundo parámetro: Nombre de la llave foránea en la tabla 'exam_options' 
        // (Si en tu base de datos se llama 'exam_id' o 'question_id', cámbialo aquí abajo)
        // Tercer parámetro: Clave primaria en la tabla 'module_exams' ('id')
        return $this->belongsTo(ModuleExam::class, 'module_exam_id', 'id');
    }
}