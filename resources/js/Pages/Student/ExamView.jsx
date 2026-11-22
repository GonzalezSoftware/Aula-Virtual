import { useState, useEffect, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function ExamView({ course, module, exams = [], attemptNumber = 1 }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(45);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentExam = exams[currentQuestionIndex] || null;
    const currentOptions = Array.isArray(currentExam?.options)
        ? currentExam.options
        : Object.values(currentExam?.options || {});

    const submitExam = useCallback((finalAnswers) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        Swal.fire({
            title: 'Enviando evaluación...',
            text: 'Calculando tus resultados finales sobre 20.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => Swal.showLoading(),
        });

        router.post(
            `/student/courses/${course.id}/modules/${module.id}/exam/submit`,
            { answers: finalAnswers },
            {
                onSuccess: (page) => {
                    Swal.close();
                    const successMsg =
                        page?.props?.flash?.success ||
                        (page?.props?.flash?.exam_score
                            ? `¡Has terminado el examen! Tu nota obtenida es: ${page.props.flash.exam_score} / 20.`
                            : '¡Has terminado el examen! Puedes consultar tu calificación detallada en Mis Calificaciones.');

                    Swal.fire({
                        icon: 'success',
                        title: '¡Examen Terminado!',
                        text: successMsg,
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#0066FF',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    });
                },
                onError: (errors) => {
                    Swal.close();
                    const errText = errors?.error || 'Ocurrió un error al enviar la evaluación.';
                    Swal.fire({
                        icon: 'warning',
                        title: 'Atención',
                        text: errText,
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#0066FF',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    });
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            }
        );
    }, [course.id, module.id, isSubmitting]);

    const handleNextQuestion = useCallback(() => {
        if (currentQuestionIndex < exams.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setTimeLeft(45);
        } else {
            submitExam(answers);
        }
    }, [currentQuestionIndex, exams.length, answers, submitExam]);

    useEffect(() => {
        if (!currentExam || isSubmitting) return;

        if (timeLeft <= 0) {
            handleNextQuestion();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, currentExam, isSubmitting, handleNextQuestion]);

    const handleSelectOption = (examId, optionId) => {
        setAnswers((prev) => ({
            ...prev,
            [examId]: optionId,
        }));
    };

    if (!currentExam) {
        return null;
    }

    const letters = ['A', 'B', 'C', 'D'];

    return (
        <>
            <Head title={`Evaluación - ${module.title}`} />

            <div className="min-h-screen bg-[#F8FAFC] text-[#0A2540] font-['Poppins'] flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-blue-100 p-8 space-y-6">
                    <div className="flex flex-wrap justify-between items-center border-b border-blue-100 pb-4 gap-2">
                        <span className="text-xs font-bold bg-blue-50 text-[#0066FF] px-3.5 py-1 rounded-full uppercase tracking-wider">
                            Pregunta {currentQuestionIndex + 1} de {exams.length} (Intento #{attemptNumber})
                        </span>

                        <div className="flex items-center gap-2 text-red-600 font-bold text-xs bg-red-50 px-3.5 py-1.5 rounded-xl border border-red-100 shadow-sm">
                            <span>⏱️ Tiempo restante:</span>
                            <span className="text-sm">{timeLeft}s</span>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-semibold text-[#4A607A] mb-1">
                            {course?.title} — {module?.title}
                        </p>
                        <h2 className="text-lg md:text-xl font-extrabold text-[#051C33] leading-snug">
                            {currentExam.question}
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {currentOptions.length > 0 ? (
                            currentOptions.map((option, idx) => {
                                const isSelected = Number(answers[currentExam.id]) === Number(option.id);
                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => handleSelectOption(currentExam.id, option.id)}
                                        className={`w-full text-left px-5 py-4 rounded-2xl border text-sm font-medium transition-all flex items-center justify-between ${
                                            isSelected
                                                ? 'bg-blue-50/80 border-[#0066FF] text-[#0066FF] shadow-sm'
                                                : 'bg-slate-50 border-slate-200 text-[#051C33] hover:bg-slate-100'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-xs px-2 py-1 bg-white border border-slate-200 rounded-lg">
                                                {letters[idx] || (idx + 1)}
                                            </span>
                                            <span>{option.text}</span>
                                        </div>
                                        <span
                                            className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 ${
                                                isSelected
                                                    ? 'border-[#0066FF] bg-[#0066FF] text-white'
                                                    : 'border-slate-300'
                                            }`}
                                        >
                                            {isSelected ? '✓' : ''}
                                        </span>
                                    </button>
                                );
                            })
                        ) : (
                            <p className="text-sm text-red-500">
                                No se encontraron opciones para esta pregunta.
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={handleNextQuestion}
                            className="px-6 py-3 bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/25 transition disabled:opacity-50"
                        >
                            {currentQuestionIndex === exams.length - 1
                                ? 'Finalizar y Enviar Examen'
                                : 'Siguiente Pregunta ➔'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}