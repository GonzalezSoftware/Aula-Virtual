<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ModuleExam extends Model
{
    protected $fillable = ['module_id', 'question', 'options'];

    // Convierte automáticamente el JSON de la BD a un array de PHP y viceversa
    protected $casts = [
        'options' => 'array',
    ];

    // Relación: La evaluación pertenece a un módulo
    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }
}