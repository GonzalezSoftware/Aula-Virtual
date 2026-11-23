<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamAttempt extends Model
{
    protected $table = 'exam_attempts';

    protected $fillable = [
        'user_id',
        'module_id',
        'course_user_id',
        'attempt_number',
        'answers',
        'score',
        'submitted_at',
    ];

    protected $casts = [
        'answers' => 'array',
        'score' => 'decimal:2',
        'submitted_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }
}