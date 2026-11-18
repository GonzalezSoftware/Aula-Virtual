import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import Swal from 'sweetalert2';
import AdminSidebar from '@/Components/AdminSidebar';

export default function EditCourse({ auth, course }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const today = new Date().toISOString().split('T')[0];

    const [title, setTitle] = useState(course.title || '');
    const [description, setDescription] = useState(course.description || '');
    const [startDate, setStartDate] = useState(course.start_date || '');
    const [endDate, setEndDate] = useState(course.end_date || '');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(course.image ? `/storage/${course.image}` : null);
    const [loading, setLoading] = useState(false);
    const [activeModuleIndex, setActiveModuleIndex] = useState(0);

    // Precargamos los módulos existentes del curso
    const [modules, setModules] = useState(
        course.modules && course.modules.length > 0 
            ? course.modules.map(mod => ({
                title: mod.title || '',
                start_date: mod.start_date || '',
                end_date: mod.end_date || '',
                exam_start_date: mod.exam_start_date || '',
                exam_end_date: mod.exam_end_date || '',
                contents: mod.contents ? mod.contents.map(c => ({
                    title: c.title || '',
                    type: c.type || 'video',
                    videoSource: c.url ? 'url' : 'file',
                    file: null,
                    file_path: c.file_path || null,
                    url: c.url || ''
                })) : [],
                exams: mod.exams && mod.exams.length > 0 ? mod.exams.map(e => ({
                    question: e.question || '',
                    options: e.options && e.options.length > 0 ? e.options.map(o => ({
                        text: o.text || '',
                        is_correct: !!o.is_correct
                    })) : [
                        { text: '', is_correct: true },
                        { text: '', is_correct: false },
                        { text: '', is_correct: false },
                        { text: '', is_correct: false },
                    ]
                })) : [{
                    question: '',
                    options: [
                        { text: '', is_correct: true },
                        { text: '', is_correct: false },
                        { text: '', is_correct: false },
                        { text: '', is_correct: false },
                    ]
                }]
            }))
            : [{
                title: '',
                start_date: '',
                end_date: '',
                exam_start_date: '',
                exam_end_date: '',
                contents: [],
                exams: [{
                    question: '',
                    options: [
                        { text: '', is_correct: true },
                        { text: '', is_correct: false },
                        { text: '', is_correct: false },
                        { text: '', is_correct: false },
                    ]
                }]
            }]
    );

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const addModule = () => {
        const newModules = [
            ...modules,
            {
                title: '',
                start_date: startDate || '',
                end_date: endDate || '',
                exam_start_date: startDate || '',
                exam_end_date: endDate || '',
                contents: [],
                exams: [
                    {
                        question: '',
                        options: [
                            { text: '', is_correct: true },
                            { text: '', is_correct: false },
                            { text: '', is_correct: false },
                            { text: '', is_correct: false },
                        ]
                    }
                ]
            }
        ];
        setModules(newModules);
        setActiveModuleIndex(newModules.length - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const removeModule = (modIndex) => {
        if (modules.length === 1) {
            Swal.fire('Atención', 'El curso debe tener al menos un módulo.', 'info');
            return;
        }
        const updated = modules.filter((_, idx) => idx !== modIndex);
        setModules(updated);
        if (activeModuleIndex >= updated.length) {
            setActiveModuleIndex(updated.length - 1);
        }
    };

    const updateModuleTitle = (value) => {
        const updated = [...modules];
        updated[activeModuleIndex].title = value;
        setModules(updated);
    };

    const updateModuleField = (field, value) => {
        const updated = [...modules];
        updated[activeModuleIndex][field] = value;
        setModules(updated);
    };

    const addContent = (type) => {
        const updated = [...modules];
        updated[activeModuleIndex].contents.push({
            title: '',
            type: type,
            videoSource: 'url',
            file: null,
            file_path: null,
            url: ''
        });
        setModules(updated);
    };

    const removeContent = (contIndex) => {
        const updated = [...modules];
        updated[activeModuleIndex].contents = updated[activeModuleIndex].contents.filter((_, idx) => idx !== contIndex);
        setModules(updated);
    };

    const updateContentField = (contIndex, field, value) => {
        const updated = [...modules];
        updated[activeModuleIndex].contents[contIndex][field] = value;
        setModules(updated);
    };

    const addExam = () => {
        const updated = [...modules];
        updated[activeModuleIndex].exams.push({
            question: '',
            options: [
                { text: '', is_correct: true },
                { text: '', is_correct: false },
                { text: '', is_correct: false },
                { text: '', is_correct: false },
            ]
        });
        setModules(updated);
    };

    const removeExam = (examIndex) => {
        const updated = [...modules];
        updated[activeModuleIndex].exams = updated[activeModuleIndex].exams.filter((_, idx) => idx !== examIndex);
        setModules(updated);
    };

    const updateExamQuestion = (examIndex, value) => {
        const updated = [...modules];
        updated[activeModuleIndex].exams[examIndex].question = value;
        setModules(updated);
    };

    const updateOptionText = (examIndex, optIndex, value) => {
        const updated = [...modules];
        updated[activeModuleIndex].exams[examIndex].options[optIndex].text = value;
        setModules(updated);
    };

    const setCorrectOption = (examIndex, optIndex) => {
        const updated = [...modules];
        updated[activeModuleIndex].exams[examIndex].options = updated[activeModuleIndex].exams[examIndex].options.map(
            (opt, idx) => ({
                ...opt,
                is_correct: idx === optIndex
            })
        );
        setModules(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (startDate && endDate && endDate < startDate) {
            Swal.fire({
                icon: 'warning',
                title: 'Fechas incorrectas',
                text: 'La fecha de culminación del curso no puede ser anterior a la fecha de inicio.'
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (startDate) formData.append('start_date', startDate);
        if (endDate) formData.append('end_date', endDate);
        if (image) formData.append('image', image);

        modules.forEach((mod, modIndex) => {
            formData.append(`modules[${modIndex}][title]`, mod.title);
            if (mod.start_date) formData.append(`modules[${modIndex}][start_date]`, mod.start_date);
            if (mod.end_date) formData.append(`modules[${modIndex}][end_date]`, mod.end_date);
            if (mod.exam_start_date) formData.append(`modules[${modIndex}][exam_start_date]`, mod.exam_start_date);
            if (mod.exam_end_date) formData.append(`modules[${modIndex}][exam_end_date]`, mod.exam_end_date);

            mod.contents.forEach((cont, contIndex) => {
                formData.append(`modules[${modIndex}][contents][${contIndex}][title]`, cont.title);
                formData.append(`modules[${modIndex}][contents][${contIndex}][type]`, cont.type);
                if (cont.file) {
                    formData.append(`modules[${modIndex}][contents][${contIndex}][file]`, cont.file);
                } else if (cont.file_path) {
                    formData.append(`modules[${modIndex}][contents][${contIndex}][file_path]`, cont.file_path);
                }
                if (cont.url) formData.append(`modules[${modIndex}][contents][${contIndex}][url]`, cont.url);
            });

            mod.exams.forEach((exam, examIndex) => {
                formData.append(`modules[${modIndex}][exams][${examIndex}][question]`, exam.question);
                exam.options.forEach((opt, optIndex) => {
                    formData.append(`modules[${modIndex}][exams][${examIndex}][options][${optIndex}][text]`, opt.text);
                    formData.append(`modules[${modIndex}][exams][${examIndex}][options][${optIndex}][is_correct]`, opt.is_correct ? '1' : '0');
                });
            });
        });

        try {
            await axios.post(route('admin.courses.update', course.id), formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            Swal.fire({
                icon: 'success',
                title: '¡Curso Actualizado!',
                text: 'Los cambios se han guardado con éxito.'
            }).then(() => {
                window.location.href = route('admin.courses.edit.list');
            });

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error al actualizar',
                text: error.response?.data?.message || 'Ocurrió un error al procesar la solicitud.'
            });
        } finally {
            setLoading(false);
        }
    };

    const currentModule = modules[activeModuleIndex] || modules[0];

    return (
        <>
            <Head title={`Editar Curso: ${course.title} - Panel Admin`} />
            
            <div className="min-h-screen bg-[#F8FAFC] text-[#0A2540] font-['Poppins'] flex">
                <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeMenu="edit-courses" />

                <div className="flex-1 flex flex-col justify-between min-h-screen overflow-x-hidden">
                    <header className="w-full bg-white/95 backdrop-blur-md border-b border-blue-100 px-8 h-20 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                        <h2 className="text-lg font-extrabold text-[#051C33] tracking-tight">Panel de Administración</h2>
                        <div className="flex items-center gap-5">
                            <span className="text-sm font-bold text-[#051C33]">{auth?.user?.name || 'Administrador'}</span>
                        </div>
                    </header>

                    <main className="max-w-5xl mx-auto px-8 py-10 w-full flex-grow">
                        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-blue-900/5 border border-blue-100">
                            <div className="flex justify-between items-center mb-6 border-b border-blue-100 pb-4">
                                <h1 className="text-2xl font-extrabold text-[#051C33]">
                                    Editando Curso: {course.title}
                                </h1>
                                <Link
                                    href={route('admin.courses.edit.list')}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                                >
                                    ← Volver al listado
                                </Link>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#F8FAFC] p-6 rounded-2xl border border-blue-100/80">
                                    <div className="md:col-span-2 space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-[#051C33] mb-1.5">Título del Curso *</label>
                                            <input
                                                type="text"
                                                required
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="w-full border border-blue-200/80 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#0066FF]/25 focus:border-[#0066FF] outline-none bg-white text-sm text-[#051C33]"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-[#051C33] mb-1">Fecha de Inicio del Curso</label>
                                                <input
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    className="w-full border border-blue-200/80 rounded-xl px-3 py-2 text-xs outline-none bg-white text-[#051C33]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-[#051C33] mb-1">Fecha de Culminación del Curso</label>
                                                <input
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) => setEndDate(e.target.value)}
                                                    className="w-full border border-blue-200/80 rounded-xl px-3 py-2 text-xs outline-none bg-white text-[#051C33]"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-[#051C33] mb-1.5">Descripción *</label>
                                            <textarea
                                                required
                                                rows="3"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className="w-full border border-blue-200/80 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#0066FF]/25 focus:border-[#0066FF] outline-none bg-white text-sm text-[#051C33]"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-2xl p-4 bg-white shadow-sm">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Portada" className="w-full h-36 object-cover rounded-xl mb-3 shadow-sm" />
                                        ) : (
                                            <div className="text-center text-slate-400 py-6 text-sm">Sin imagen</div>
                                        )}
                                        <label className="cursor-pointer bg-[#E3F2FD] text-[#0066FF] hover:bg-[#0066FF] hover:text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-sm">
                                            Cambiar Portada
                                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-4 border-t border-blue-100">
                                    <div className="sticky top-20 bg-white/95 backdrop-blur-md py-4 z-10 border-b border-blue-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
                                        <div>
                                            <h2 className="text-base font-extrabold text-[#051C33]">Estructura del Curso</h2>
                                            <p className="text-xs text-[#4A607A]">Módulos creados</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                                            {modules.map((mod, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => setActiveModuleIndex(idx)}
                                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-sm ${
                                                        activeModuleIndex === idx ? 'bg-[#0066FF] text-white' : 'bg-[#F8FAFC] text-[#4A607A] border border-blue-100'
                                                    }`}
                                                >
                                                    <span>Módulo {idx + 1}</span>
                                                </button>
                                            ))}
                                        </div>
                                        <button type="button" onClick={addModule} className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-md">
                                            + Agregar Módulo
                                        </button>
                                    </div>

                                    <div className="border border-blue-200/80 rounded-3xl p-6 bg-white shadow-xl shadow-blue-950/5 space-y-6 mt-4">
                                        <div className="flex justify-between items-center gap-4 border-b border-blue-100 pb-4">
                                            <input
                                                type="text"
                                                required
                                                value={currentModule.title}
                                                onChange={(e) => updateModuleTitle(e.target.value)}
                                                placeholder="Nombre del módulo"
                                                className="w-full border border-blue-200/80 rounded-xl px-4 py-2 text-sm font-medium outline-none bg-white text-[#051C33]"
                                            />
                                            {modules.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeModule(activeModuleIndex)}
                                                    className="px-3.5 py-1.5 bg-red-50 text-red-600 rounded-xl text-xs font-semibold hover:bg-red-600 hover:text-white transition whitespace-nowrap"
                                                >
                                                    Eliminar Módulo
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#F8FAFC] p-4 rounded-2xl border border-blue-100">
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#4A607A] mb-1">Inicio del Módulo</label>
                                                <input
                                                    type="date"
                                                    value={currentModule.start_date}
                                                    onChange={(e) => updateModuleField('start_date', e.target.value)}
                                                    className="w-full border border-blue-200/80 rounded-xl px-3 py-1.5 text-xs outline-none bg-white text-[#051C33]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#4A607A] mb-1">Fin del Módulo</label>
                                                <input
                                                    type="date"
                                                    value={currentModule.end_date}
                                                    onChange={(e) => updateModuleField('end_date', e.target.value)}
                                                    className="w-full border border-blue-200/80 rounded-xl px-3 py-1.5 text-xs outline-none bg-white text-[#051C33]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#4A607A] mb-1">Inicio de la Evaluación</label>
                                                <input
                                                    type="date"
                                                    value={currentModule.exam_start_date}
                                                    onChange={(e) => updateModuleField('exam_start_date', e.target.value)}
                                                    className="w-full border border-blue-200/80 rounded-xl px-3 py-1.5 text-xs outline-none bg-white text-[#051C33]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#4A607A] mb-1">Fin de la Evaluación</label>
                                                <input
                                                    type="date"
                                                    value={currentModule.exam_end_date}
                                                    onChange={(e) => updateModuleField('exam_end_date', e.target.value)}
                                                    className="w-full border border-blue-200/80 rounded-xl px-3 py-1.5 text-xs outline-none bg-white text-[#051C33]"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button type="button" onClick={() => addContent('pdf')} className="bg-[#E3F2FD] text-[#0066FF] px-3.5 py-2 rounded-xl text-xs font-semibold">+ Agregar PDF</button>
                                            <button type="button" onClick={() => addContent('video')} className="bg-[#E3F2FD] text-[#0066FF] px-3.5 py-2 rounded-xl text-xs font-semibold">+ Agregar Video</button>
                                            <button type="button" onClick={addExam} className="bg-blue-50 text-[#051C33] px-3.5 py-2 rounded-xl text-xs font-semibold">+ Agregar Pregunta de Examen</button>
                                        </div>

                                        {/* CONTENIDOS */}
                                        {currentModule.contents.length > 0 && (
                                            <div className="space-y-4 pt-4 border-t border-blue-100">
                                                <h4 className="text-xs font-bold text-[#051C33] uppercase tracking-wider">Contenidos del Módulo</h4>
                                                {currentModule.contents.map((content, contIndex) => (
                                                    <div key={contIndex} className="p-4 bg-[#F8FAFC] rounded-2xl border border-blue-100 space-y-3">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-lg uppercase">
                                                                {content.type}
                                                            </span>
                                                            <input
                                                                type="text"
                                                                required
                                                                value={content.title}
                                                                onChange={(e) => updateContentField(contIndex, 'title', e.target.value)}
                                                                placeholder={`Título del ${content.type}`}
                                                                className="flex-1 border border-blue-200/80 rounded-xl px-4 py-2 text-xs outline-none bg-white text-[#051C33] font-medium"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeContent(contIndex)}
                                                                className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>

                                                        {content.type === 'pdf' && (
                                                            <div>
                                                                {content.file_path && <p className="text-[11px] text-emerald-600 mb-1">Archivo actual guardado.</p>}
                                                                <input
                                                                    type="file"
                                                                    accept="application/pdf"
                                                                    onChange={(e) => updateContentField(contIndex, 'file', e.target.files[0])}
                                                                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#0066FF] cursor-pointer"
                                                                />
                                                            </div>
                                                        )}

                                                        {content.type === 'video' && (
                                                            <div className="space-y-3">
                                                                <input
                                                                    type="url"
                                                                    value={content.url || ''}
                                                                    onChange={(e) => updateContentField(contIndex, 'url', e.target.value)}
                                                                    placeholder="https://www.youtube.com/watch?v=..."
                                                                    className="w-full border border-blue-200/80 rounded-xl px-4 py-2 text-xs outline-none bg-white text-[#051C33]"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* PREGUNTAS Y OPCIONES */}
                                        {currentModule.exams.length > 0 && (
                                            <div className="space-y-4 pt-4 border-t border-blue-100">
                                                <h4 className="text-xs font-bold text-[#051C33] uppercase tracking-wider">Preguntas del Examen</h4>
                                                {currentModule.exams.map((exam, examIndex) => (
                                                    <div key={examIndex} className="p-5 bg-[#F8FAFC] rounded-2xl border border-blue-100 space-y-4">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-lg">
                                                                P{examIndex + 1}
                                                            </span>
                                                            <input
                                                                type="text"
                                                                required
                                                                value={exam.question}
                                                                onChange={(e) => updateExamQuestion(examIndex, e.target.value)}
                                                                placeholder="Escribe la pregunta..."
                                                                className="flex-1 border border-blue-200/80 rounded-xl px-4 py-2 text-xs outline-none bg-white text-[#051C33] font-medium"
                                                            />
                                                            {currentModule.exams.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeExam(examIndex)}
                                                                    className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1"
                                                                >
                                                                    ✕
                                                                </button>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-8">
                                                            {exam.options.map((option, optIndex) => (
                                                                <div key={optIndex} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-blue-100 shadow-sm">
                                                                    <input
                                                                        type="radio"
                                                                        name={`correct_opt_${activeModuleIndex}_${examIndex}`}
                                                                        checked={option.is_correct}
                                                                        onChange={() => setCorrectOption(examIndex, optIndex)}
                                                                        className="w-4 h-4 text-blue-600 cursor-pointer"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        required
                                                                        value={option.text}
                                                                        onChange={(e) => updateOptionText(examIndex, optIndex, e.target.value)}
                                                                        placeholder={`Opción ${optIndex + 1}`}
                                                                        className="w-full border-none outline-none text-xs text-[#051C33] bg-transparent"
                                                                    />
                                                                    {option.is_correct && (
                                                                        <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded">
                                                                            Correcta
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6 border-t border-blue-100">
                                    <button type="submit" disabled={loading} className="bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold px-8 py-3 rounded-xl shadow-lg transition text-sm">
                                        {loading ? 'Guardando Cambios...' : 'Actualizar Curso Completo'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </main>
                    <footer className="h-12 bg-white border-t border-blue-100"></footer>
                </div>
            </div>
        </>
    );
}