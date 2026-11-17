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
        Schema::table('exam_options', function (Blueprint $table) {
            // Añadimos la columna booleana indicando si la opción es correcta
            $table->boolean('is_correct')->default(false)->after('text');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exam_options', function (Blueprint $table) {
            $table->dropColumn('is_correct');
        });
    }
};