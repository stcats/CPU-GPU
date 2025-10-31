
import React from 'react';
import { SparklesIcon } from './icons';

export const worksheetData = [
    { 
        part: "A", 
        title: "Run the Baseline",
        questions: [
            { id: "q1", text: "Record frame-rate (FPS) or render time (ms).", param: "renderTime" },
            { id: "q2", text: "Describe what you see. (e.g., how the image is drawn)", param: "description" },
            { id: "q3", text: "List the current parameter values.", param: "params" },
        ]
    },
    {
        part: "B",
        title: "Change One Parameter",
        questions: [
            { id: "q4", text: "Change THREAD_COUNT to double the baseline. New frame-rate/render time:", param: "renderTime" },
            { id: "q5", text: "What changed visually or performance-wise?", param: "change" },
            { id: "q6", text: "Why do you think this happened?", param: "reason" },
            { id: "q7", text: "Restore THREAD_COUNT to baseline. Change MEMORY_BUFFER_SIZE to a higher value. New frame-rate/render time:", param: "renderTime" },
            { id: "q8", text: "What changed?", param: "change" },
            { id: "q9", text: "Why do you think this happened?", param: "reason" },
        ]
    },
    {
        part: "C",
        title: "Combine High Cores + High Bandwidth",
        questions: [
            { id: "q10", text: "Set both THREAD_COUNT and MEMORY_BUFFER_SIZE to high values. New frame-rate/render time:", param: "renderTime" },
            { id: "q11", text: "Did performance improve as much as expected? Why or why not?", param: "reason" },
        ]
    }
];

interface WorksheetProps {
    answers: Record<string, string>;
    setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    onMarkWithAI: () => void;
    isMarking: boolean;
}

const Worksheet: React.FC<WorksheetProps> = ({ answers, setAnswers, onMarkWithAI, isMarking }) => {
    
    const handleAnswerChange = (id: string, value: string) => {
        setAnswers(prev => ({...prev, [id]: value}));
    };

    return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 space-y-6 shadow-lg h-full flex flex-col">
            <h2 className="text-xl font-bold text-white flex-shrink-0">Student Worksheet</h2>
            <div className="flex-grow space-y-6 overflow-y-auto pr-2 -mr-2">
                {worksheetData.map((section, sectionIndex) => (
                    <div key={section.part} className="space-y-4">
                        <h3 className="text-lg font-semibold text-blue-accent border-b border-gray-700 pb-2">
                            Part {section.part} – {section.title}
                        </h3>
                        {section.questions.map((q, qIndex) => (
                            <div key={q.id}>
                                <label htmlFor={q.id} className="block text-sm text-gray-300 mb-1">
                                    {`${sectionIndex * 3 + qIndex + 1}. ${q.text}`}
                                </label>
                                <textarea
                                    id={q.id}
                                    rows={2}
                                    value={answers[q.id] || ''}
                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                    placeholder="Record your observations here..."
                                    className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-sm text-gray-200 focus:ring-2 focus:ring-blue-accent focus:border-blue-accent transition"
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700 flex-shrink-0">
                <button
                    onClick={onMarkWithAI}
                    disabled={isMarking}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-accent text-white font-bold rounded-lg shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <SparklesIcon />
                    <span>{isMarking ? 'Evaluating Answers...' : 'Mark with AI'}</span>
                </button>
            </div>
        </div>
    );
};

export default Worksheet;
