<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ModuleExam extends Model
{
    protected $fillable = ['module_id', 'question'];

    // Relación: La evaluación pertenece a un módulo
    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    // Relación: Una evaluación (pregunta) tiene muchas opciones de respuesta
    public function options(): HasMany
    {
        // NOTA: Si en tu base de datos la columna se llama 'exam_id' o 'question_id', 
        // reemplaza 'module_exam_id' por el nombre correcto de tu columna.
        return $this->hasMany(ExamOption::class, 'module_exam_id'); 
    }
}