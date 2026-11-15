<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Module extends Model
{
    protected $fillable = [
    'course_id', 
    'title', 
    'start_date', 
    'end_date', 
    'exam_start_date', 
    'exam_end_date', 
    'order'
  ];

    // Relación: Un módulo pertenece a un curso
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    // Relación: Un módulo tiene muchos contenidos (PDFs, videos)
    public function contents(): HasMany
    {
        return $this->hasMany(ModuleContent::class)->orderBy('order');
    }

    // Relación: Un módulo tiene varias preguntas de evaluación
    public function exams(): HasMany
    {
        return $this->hasMany(ModuleExam::class);
    }
}