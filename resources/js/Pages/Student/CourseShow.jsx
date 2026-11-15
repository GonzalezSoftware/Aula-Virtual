import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function CourseShow({ course }) {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Head title={course.title} />
            <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
            <p className="text-gray-600 mb-6">{course.description}</p>

            <h2 className="text-xl font-semibold mb-3">Módulos del Curso</h2>
            <div className="space-y-4">
                {course.modules && course.modules.map((module) => (
                    <div key={module.id} className="p-4 border rounded-lg shadow-sm bg-white flex justify-between items-center">
                        <div>
                            <h3 className="font-medium">{module.title}</h3>
                            <p className="text-sm text-gray-500">{module.description}</p>
                        </div>
                        <Link 
                            href={route('student.courses.modules.show', [course.id, module.id])}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                            Ver Módulo
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}