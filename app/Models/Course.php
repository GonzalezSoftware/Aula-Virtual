<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    // Campos permitidos para asignación masiva
    protected $fillable = ['title', 'description', 'image'];

    // Relación: Un curso tiene muchos módulos
    public function modules(): HasMany
    {
        return $this->hasMany(Module::class)->orderBy('order');
    }
}