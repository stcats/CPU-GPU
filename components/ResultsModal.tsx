
import React from 'react';
import { CloseIcon, DownloadIcon } from './icons';

interface AIResult {
    score: number;
    feedback: string;
    cheatsheet: string;
}

interface ResultsModalProps {
    results: AIResult;
    onClose: () => void;
    onDownload: () => void;
}

const ResultsModal: React.FC<ResultsModalProps> = ({ results, onClose, onDownload }) => {
    const getScoreColor = (score: number) => {
        if (score >= 85) return 'text-green-accent';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-500';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
                    <h2 className="text-xl font-bold text-white">AI Evaluation Results</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <CloseIcon />
                    </button>
                </header>

                <main className="p-6 flex-grow overflow-y-auto space-y-6">
                    <div className="flex items-center justify-center space-x-6 bg-gray-800 p-6 rounded-lg">
                        <div className="text-center">
                            <p className="text-sm text-gray-400">Your Score</p>
                            <p className={`text-6xl font-bold ${getScoreColor(results.score)}`}>
                                {results.score}
                                <span className="text-3xl text-gray-400">/100</span>
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-blue-accent mb-2">Detailed Feedback</h3>
                        <div className="bg-gray-800 border border-gray-700 rounded-md p-4 max-h-60 overflow-y-auto">
                           <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">{results.feedback}</pre>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-blue-accent mb-2">Key Concepts Cheatsheet</h3>
                        <div className="bg-gray-800 border border-gray-700 rounded-md p-4 max-h-60 overflow-y-auto">
                            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">{results.cheatsheet}</pre>
                        </div>
                    </div>
                </main>

                <footer className="p-4 border-t border-gray-700 flex-shrink-0">
                    <button
                        onClick={onDownload}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-accent text-white font-bold rounded-lg shadow-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                        <DownloadIcon />
                        <span>Download Report</span>
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ResultsModal;
