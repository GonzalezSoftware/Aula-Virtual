import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function CreateCourse({ auth }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const [activeModuleIndex, setActiveModuleIndex] = useState(0);

    const [modules, setModules] = useState([
        {
            title: '',
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
    ]);

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

    const addContent = (type) => {
        const updated = [...modules];
        updated[activeModuleIndex].contents.push({
            title: '',
            type: type,
            videoSource: 'url',
            file: null,
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

        for (let m = 0; m < modules.length; m++) {
            for (let ex = 0; ex < modules[m].exams.length; ex++) {
                const exam = modules[m].exams[ex];
                const hasCorrect = exam.options.some((o) => o.is_correct);
                const emptyOption = exam.options.some((o) => !o.text.trim());
                if (!hasCorrect || emptyOption || exam.options.length < 4) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Evaluación incompleta',
                        text: `Verifica que la pregunta ${ex + 1} del Módulo ${m + 1} tenga sus 4 respuestas redactadas y una marcada como correcta.`
                    });
                    setActiveModuleIndex(m);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                    return;
                }
            }
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (image) formData.append('image', image);

        modules.forEach((mod, modIndex) => {
            formData.append(`modules[${modIndex}][title]`, mod.title);

            mod.contents.forEach((cont, contIndex) => {
                formData.append(`modules[${modIndex}][contents][${contIndex}][title]`, cont.title);
                formData.append(`modules[${modIndex}][contents][${contIndex}][type]`, cont.type);
                if (cont.file) {
                    formData.append(`modules[${modIndex}][contents][${contIndex}][file]`, cont.file);
                }
                if (cont.url) {
                    formData.append(`modules[${modIndex}][contents][${contIndex}][url]`, cont.url);
                }
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
            // RUTA CORREGIDA A /admin/courses (coincide con web.php)
            await axios.post('/admin/courses', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            Swal.fire({
                icon: 'success',
                title: '¡Curso Creado!',
                text: 'El curso y todos sus componentes se han guardado con éxito.'
            });

            setTitle('');
            setDescription('');
            setImage(null);
            setImagePreview(null);
            setActiveModuleIndex(0);
            setModules([{
                title: '',
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
            }]);
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error al registrar',
                text: error.response?.data?.message || 'Ocurrió un error al procesar la solicitud.'
            });
        } finally {
            setLoading(false);
        }
    };

    const currentModule = modules[activeModuleIndex] || modules[0];

    return (
        <>
            <Head title="Crear Curso - Panel de Administración" />
            
            <div className="min-h-screen bg-[#F8FAFC] text-[#0A2540] font-['Poppins'] flex">
                
                {/* SIDEBAR FIJO */}
                <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#051C33] text-white border-r border-slate-800 transition-all duration-300 flex flex-col justify-between sticky top-0 h-screen z-30 shadow-xl shrink-0`}>
                    <div>
                        <div className="h-20 px-6 flex items-center gap-3 border-b border-white/10">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0066FF] to-[#3385FF] flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/25 shrink-0">
                                AD
                            </div>
                            {sidebarOpen && (
                                <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                                    Panel <span className="text-[#3385FF]">Admin</span>
                                </span>
                            )}
                        </div>

                        <nav className="p-4 space-y-2">
                            <Link
                                href={route('admin.dashboard')}
                                className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white font-medium text-sm transition"
                            >
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                                {sidebarOpen && <span>Dashboard</span>}
                            </Link>

                            <Link
                                href={route('admin.students.index')}
                                className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white font-medium text-sm transition"
                            >
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                {sidebarOpen && <span>Estudiantes</span>}
                            </Link>

                            <Link
                                href={route('admin.students.pending')}
                                className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white font-medium text-sm transition"
                            >
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {sidebarOpen && <span>Estudiantes en Espera</span>}
                            </Link>

                            <Link
                                href={route('admin.courses.create')}
                                className="flex items-center gap-3.5 px-4 py-3 rounded-xl bg-[#0066FF] text-white font-medium text-sm transition shadow-md shadow-blue-600/20"
                            >
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                {sidebarOpen && <span>Crear Curso</span>}
                            </Link>
                        </nav>
                    </div>

                    <div className="p-4 border-t border-white/10">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold flex items-center justify-center gap-2 transition"
                        >
                            <span>{sidebarOpen ? '◀ Ocultar' : '▶'}</span>
                        </button>
                    </div>
                </aside>

                {/* CONTENEDOR PRINCIPAL */}
                <div className="flex-1 flex flex-col justify-between min-h-screen overflow-x-hidden">
                    
                    {/* BARRA SUPERIOR */}
                    <header className="w-full bg-white/95 backdrop-blur-md border-b border-blue-100 px-8 h-20 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-extrabold text-[#051C33] tracking-tight">
                                Panel de Administración
                            </h2>
                        </div>

                        <div className="flex items-center gap-5">
                            <div className="text-right hidden sm:block">
                                <span className="text-xs text-[#4A607A] block">Administrador Maestro</span>
                                <span className="text-sm font-bold text-[#051C33]">{auth?.user?.name || 'Administrador'}</span>
                            </div>

                            <Link
                                href={route('admin.logout')}
                                method="post"
                                as="button"
                                className="px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-600 hover:text-white transition flex items-center gap-2 shadow-sm"
                            >
                                <span>Cerrar Sesión</span>
                            </Link>
                        </div>
                    </header>

                    {/* CONTENIDO DEL FORMULARIO */}
                    <main className="max-w-5xl mx-auto px-8 py-10 w-full flex-grow">
                        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-blue-900/5 border border-blue-100">
                            <h1 className="text-2xl font-extrabold text-[#051C33] mb-6 border-b border-blue-100 pb-4">
                                Crear Nuevo Curso y Módulos
                            </h1>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* INFORMACIÓN GENERAL */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#F8FAFC] p-6 rounded-2xl border border-blue-100/80">
                                    <div className="md:col-span-2 space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-[#051C33] mb-1.5">
                                                Título del Curso *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="Ej. Programación Avanzada en Laravel"
                                                className="w-full border border-blue-200/80 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#0066FF]/25 focus:border-[#0066FF] outline-none bg-white text-sm text-[#051C33]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-[#051C33] mb-1.5">
                                                Descripción *
                                            </label>
                                            <textarea
                                                required
                                                rows="4"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Detalles generales del curso..."
                                                className="w-full border border-blue-200/80 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#0066FF]/25 focus:border-[#0066FF] outline-none bg-white text-sm text-[#051C33]"
                                            />
                                        </div>
                                    </div>

                                    {/* Imagen de Portada */}
                                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-2xl p-4 bg-white shadow-sm">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Portada"
                                                className="w-full h-36 object-cover rounded-xl mb-3 shadow-sm"
                                            />
                                        ) : (
                                            <div className="text-center text-slate-400 py-6 text-sm">
                                                Sin imagen seleccionada
                                            </div>
                                        )}
                                        <label className="cursor-pointer bg-[#E3F2FD] text-[#0066FF] hover:bg-[#0066FF] hover:text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-sm">
                                            Subir Portada
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* SECCIÓN DE MÓDULOS CON BARRA STICKY */}
                                <div className="space-y-6 pt-4 border-t border-blue-100">
                                    
                                    {/* BARRA DE PESTAÑAS FIJA (STICKY) */}
                                    <div className="sticky top-20 bg-white/95 backdrop-blur-md py-4 z-10 border-b border-blue-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
                                        <div>
                                            <h2 className="text-base font-extrabold text-[#051C33]">Estructura del Curso</h2>
                                            <p className="text-xs text-[#4A607A]">Módulos creados (alterna entre ellos)</p>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                                            {modules.map((mod, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => {
                                                        setActiveModuleIndex(idx);
                                                        window.scrollTo({ top: 350, behavior: 'smooth' });
                                                    }}
                                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-sm ${
                                                        activeModuleIndex === idx
                                                            ? 'bg-[#0066FF] text-white shadow-blue-500/20'
                                                            : 'bg-[#F8FAFC] text-[#4A607A] border border-blue-100 hover:bg-blue-50 hover:text-[#051C33]'
                                                    }`}
                                                >
                                                    <span>Módulo {idx + 1}</span>
                                                    {mod.title && <span className="opacity-75 truncate max-w-[80px]">({mod.title})</span>}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={addModule}
                                            className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition shrink-0"
                                        >
                                            + Agregar Módulo
                                        </button>
                                    </div>

                                    {/* CONTENEDOR DEL MÓDULO ACTIVO */}
                                    <div className="border border-blue-200/80 rounded-3xl p-6 bg-white shadow-xl shadow-blue-950/5 space-y-6 mt-4">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-blue-100 pb-4">
                                            <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                                                <span className="bg-[#051C33] text-white font-bold px-3.5 py-1.5 rounded-xl text-xs tracking-wide shrink-0 shadow-sm">
                                                    Módulo Actual #{activeModuleIndex + 1}
                                                </span>
                                                <input
                                                    type="text"
                                                    required
                                                    value={currentModule.title}
                                                    onChange={(e) => updateModuleTitle(e.target.value)}
                                                    placeholder="Nombre del módulo (Ej. Introducción al tema)"
                                                    className="w-full border border-blue-200/80 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-[#0066FF]/25 focus:border-[#0066FF] outline-none bg-white text-[#051C33]"
                                                />
                                            </div>
                                            {modules.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeModule(activeModuleIndex)}
                                                    className="px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white text-xs font-semibold transition border border-red-200 shrink-0 shadow-sm"
                                                >
                                                    Eliminar este Módulo
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-3">
                                            <button
                                                type="button"
                                                onClick={() => addContent('pdf')}
                                                className="bg-[#E3F2FD] text-[#0066FF] border border-blue-200 hover:bg-[#0066FF] hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition shadow-sm"
                                            >
                                                + Agregar PDF
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => addContent('video')}
                                                className="bg-[#E3F2FD] text-[#0066FF] border border-blue-200 hover:bg-[#0066FF] hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition shadow-sm"
                                            >
                                                + Agregar Video
                                            </button>
                                            <button
                                                type="button"
                                                onClick={addExam}
                                                className="bg-blue-50 text-[#051C33] border border-blue-200 hover:bg-[#0066FF] hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition shadow-sm"
                                            >
                                                + Agregar Pregunta de Examen
                                            </button>
                                        </div>

                                        {currentModule.contents.length > 0 && (
                                            <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                                                <h3 className="text-xs font-bold text-[#4A607A] uppercase tracking-wider">Materiales de Estudio</h3>
                                                {currentModule.contents.map((cont, contIndex) => (
                                                    <div key={contIndex} className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-blue-100 flex flex-col md:flex-row gap-3 items-center shadow-sm">
                                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${cont.type === 'pdf' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-[#0066FF]'}`}>
                                                            {cont.type}
                                                        </span>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={cont.title}
                                                            onChange={(e) => updateContentField(contIndex, 'title', e.target.value)}
                                                            placeholder="Título del contenido"
                                                            className="flex-1 border border-blue-200/80 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:border-[#0066FF] text-[#051C33]"
                                                        />
                                                        {cont.type === 'pdf' ? (
                                                            <input
                                                                type="file"
                                                                accept="application/pdf"
                                                                required
                                                                onChange={(e) => updateContentField(contIndex, 'file', e.target.files[0])}
                                                                className="text-xs text-[#4A607A]"
                                                            />
                                                        ) : (
                                                            <div className="flex gap-2 items-center w-full md:w-auto">
                                                                <input
                                                                    type="url"
                                                                    required
                                                                    value={cont.url}
                                                                    onChange={(e) => updateContentField(contIndex, 'url', e.target.value)}
                                                                    placeholder="Enlace de video (YouTube/Vimeo)"
                                                                    className="border border-blue-200/80 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:border-[#0066FF] w-full text-[#051C33]"
                                                                />
                                                            </div>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeContent(contIndex)}
                                                            className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1"
                                                        >
                                                            Quitar
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {currentModule.exams.length > 0 && (
                                            <div className="space-y-4 pl-4 border-l-2 border-[#0066FF]">
                                                <h3 className="text-xs font-bold text-[#051C33] uppercase tracking-wider">Evaluaciones (Opción Múltiple)</h3>
                                                {currentModule.exams.map((exam, examIndex) => (
                                                    <div key={examIndex} className="p-4 bg-[#F8FAFC] rounded-2xl border border-blue-200/80 space-y-3 shadow-sm">
                                                        <div className="flex justify-between items-center gap-2">
                                                            <input
                                                                type="text"
                                                                required
                                                                value={exam.question}
                                                                onChange={(e) => updateExamQuestion(examIndex, e.target.value)}
                                                                placeholder={`Pregunta #${examIndex + 1}`}
                                                                className="flex-1 border border-blue-200/80 rounded-xl px-3.5 py-2 text-sm font-medium bg-white outline-none focus:border-[#0066FF] text-[#051C33]"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeExam(examIndex)}
                                                                className="text-red-500 hover:text-red-700 text-xs font-bold"
                                                            >
                                                                Eliminar Pregunta
                                                            </button>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <p className="text-xs text-[#4A607A]">Selecciona el círculo de la respuesta correcta:</p>
                                                            {exam.options.map((opt, optIndex) => (
                                                                <div key={optIndex} className="flex items-center gap-3">
                                                                    <input
                                                                        type="radio"
                                                                        name={`correct_active_m_e${examIndex}`}
                                                                        checked={opt.is_correct}
                                                                        onChange={() => setCorrectOption(examIndex, optIndex)}
                                                                        className="w-4 h-4 text-[#0066FF] cursor-pointer"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        required
                                                                        value={opt.text}
                                                                        onChange={(e) => updateOptionText(examIndex, optIndex, e.target.value)}
                                                                        placeholder={`Opción ${optIndex + 1}`}
                                                                        className={`flex-1 border rounded-xl px-3.5 py-2 text-sm bg-white outline-none ${
                                                                            opt.is_correct ? 'border-[#0066FF] ring-1 ring-[#0066FF] font-medium text-[#051C33]' : 'border-blue-200/80 text-[#051C33]'
                                                                        }`}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center pt-6 border-t border-blue-100 mt-6">
                                            <button
                                                type="button"
                                                disabled={activeModuleIndex === 0}
                                                onClick={() => {
                                                    setActiveModuleIndex(activeModuleIndex - 1);
                                                    window.scrollTo({ top: 350, behavior: 'smooth' });
                                                }}
                                                className="px-4 py-2 rounded-xl bg-[#F8FAFC] text-[#4A607A] border border-blue-200 hover:bg-blue-50 hover:text-[#051C33] disabled:opacity-40 text-xs font-semibold transition shadow-sm"
                                            >
                                                ◀ Módulo Anterior
                                            </button>

                                            <span className="text-xs font-bold text-[#4A607A]">
                                                Módulo {activeModuleIndex + 1} de {modules.length}
                                            </span>

                                            <button
                                                type="button"
                                                disabled={activeModuleIndex === modules.length - 1}
                                                onClick={() => {
                                                    setActiveModuleIndex(activeModuleIndex + 1);
                                                    window.scrollTo({ top: 350, behavior: 'smooth' });
                                                }}
                                                className="px-4 py-2 rounded-xl bg-[#E3F2FD] text-[#0066FF] border border-blue-200 hover:bg-[#0066FF] hover:text-white disabled:opacity-40 text-xs font-semibold transition shadow-sm"
                                            >
                                                Siguiente Módulo ▶
                                            </button>
                                        </div>

                                    </div>
                                </div>

                                <div className="flex justify-end pt-6 border-t border-blue-100">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-[#0066FF] hover:bg-[#0052CC] disabled:bg-gray-400 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-blue-600/25 transition text-sm"
                                    >
                                        {loading ? 'Guardando Curso...' : 'Publicar Curso Completo'}
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