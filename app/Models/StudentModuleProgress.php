<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentModuleProgress extends Model
{
    use HasFactory;

    protected $table = 'student_module_progress';

    protected $fillable = [
        'user_id',
        'module_id',
        'completed',
        'exam_score',
        'completed_at',
    ];

    protected $casts = [
        'completed' => 'boolean',
        'completed_at' => 'datetime',
        'exam_score' => 'decimal:2',
    ];

    // Relación con el estudiante (Usuario)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relación con el módulo
    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}