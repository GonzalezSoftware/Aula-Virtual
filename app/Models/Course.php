<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    // Campos permitidos para asignación masiva
    protected $fillable = ['title', 'description', 'start_date', 'end_date', 'image'];

    // Relación: Un curso tiene muchos módulos
    public function modules(): HasMany
    {
        return $this->hasMany(Module::class)->orderBy('order');
    }

    public function students()
{
    return $this->belongsToMany(User::class, 'course_user');
}
}