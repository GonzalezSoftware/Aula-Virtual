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
        return $this->hasMany(ExamOption::class);
    }
}