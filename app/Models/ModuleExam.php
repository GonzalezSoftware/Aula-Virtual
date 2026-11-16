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
        // Cambia 'module_exam_id' por el nombre real de la columna en tu tabla 'exam_options' 
        // si en tu base de datos se llama distinto (ej. 'module_exams_id' o 'exam_id')
        return $this->hasMany(ExamOption::class, 'module_exam_id', 'id');
    }
}