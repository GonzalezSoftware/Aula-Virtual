<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ModuleContent extends Model
{
    protected $fillable = ['module_id', 'title', 'type', 'file_path', 'url', 'order'];

    // Relación: El contenido pertenece a un módulo
    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }
}