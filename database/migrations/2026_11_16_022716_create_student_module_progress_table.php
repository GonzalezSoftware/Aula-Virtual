use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('student_module_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Relación con el estudiante
            $table->foreignId('module_id')->constrained()->onDelete('cascade'); // Relación con el módulo del curso
            $table->boolean('completed')->default(false); // Indica si ya completó el módulo y su examen
            $table->decimal('exam_score', 5, 2)->nullable(); // Nota obtenida (ej. 20.00 o 100.00) para promedios
            $table->timestamp('completed_at')->nullable(); // Fecha y hora exacta en que finalizó
            $table->timestamps();

            // Evitamos registros duplicados para un mismo estudiante en un mismo módulo
            $table->unique(['user_id', 'module_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_module_progress');
    }
};