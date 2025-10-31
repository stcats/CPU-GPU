
import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { ExecutionMode } from './types';
import ControlsPanel from './components/ControlsPanel';
import SimulationCanvas from './components/SimulationCanvas';
import Worksheet, { worksheetData } from './components/Worksheet';
import Concepts from './components/Concepts';
import ResultsModal from './components/ResultsModal';

// Define the type for AI results
interface AIResult {
  score: number;
  feedback: string;
  cheatsheet: string;
}

const App: React.FC = () => {
  const [mode, setMode] = useState<ExecutionMode>(ExecutionMode.CPU);
  const [threadCount, setThreadCount] = useState(128);
  const [memoryBufferSize, setMemoryBufferSize] = useState(64);
  const [fps, setFps] = useState(0);
  const [lastRenderTime, setLastRenderTime] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // New state for AI marking
  const [isMarking, setIsMarking] = useState(false);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulationComplete = useCallback((time: number) => {
    setLastRenderTime(time);
    setFps(0);
  }, []);
  
  const handleModeChange = (newMode: ExecutionMode) => {
    setMode(newMode);
    setLastRenderTime(null);
    setFps(0);
  };
  
  const handleThreadCountChange = (count: number) => {
      setThreadCount(count);
      setLastRenderTime(null);
  }
  
   const handleMemoryBufferSizeChange = (size: number) => {
      setMemoryBufferSize(size);
      setLastRenderTime(null);
  }

  const handleMarkWithAI = useCallback(async () => {
    setIsMarking(true);
    setError(null);

    const qaString = worksheetData.map(section => {
        const questionsText = section.questions.map(q => {
            return `Question: ${q.text}\nStudent Answer: ${answers[q.id] || "No answer provided."}`;
        }).join('\n\n');
        return `--- PART ${section.part}: ${section.title} ---\n${questionsText}`;
    }).join('\n\n');
    
    const userPrompt = `Please evaluate the following student answers for the GPUSim lab:\n\n${qaString}`;

    const systemInstruction = `You are a helpful and encouraging computer science teaching assistant specializing in computer architecture and parallel computing. Your task is to evaluate a student's answers from an interactive lab about CPU vs. GPU fundamentals.

Analyze the provided answers based on the following core concepts:
- Parallel vs. serial execution
- Throughput vs. latency
- The importance of memory bandwidth for GPUs
- Why matrix/vector operations are suited for parallelism

Provide a fair score out of 100, give constructive and detailed feedback in Markdown format, and generate a concise cheatsheet in Markdown format that summarizes the key learning objectives. Be positive and aim to help the student learn. Ensure your response is valid JSON.`;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER, description: 'A score for the student from 0 to 100.' },
              feedback: { type: Type.STRING, description: 'Detailed, constructive feedback on the answers, formatted as Markdown.' },
              cheatsheet: { type: Type.STRING, description: 'A concise cheatsheet summarizing the key concepts, formatted as Markdown.' },
            },
            required: ['score', 'feedback', 'cheatsheet'],
          },
        },
      });
      
      const result = JSON.parse(response.text);
      setAiResult(result);
      setShowResultsModal(true);

    } catch (e) {
      console.error("Error calling Gemini API:", e);
      setError("Failed to get a response from the AI. Please try again later.");
      alert("An error occurred while marking the worksheet. Please check the console for details.");
    } finally {
      setIsMarking(false);
    }
  }, [answers]);

  const handleDownloadReport = useCallback(() => {
    if (!aiResult) return;

    const { score, feedback, cheatsheet } = aiResult;
    const reportContent = `
# GPUSim Lab - AI Evaluation Report

## Score: ${score}/100

---

## Detailed Feedback

${feedback}

---

## Key Concepts Cheatsheet

${cheatsheet}
    `;

    const blob = new Blob([reportContent.trim()], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'GPUSim_AI_Report.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [aiResult]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 p-4 lg:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          GPUSim <span className="text-blue-accent">Lab</span>
        </h1>
        <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
          An interactive simulator to understand the fundamental performance differences between CPU and GPU architectures.
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Left Column: Controls and Concepts */}
        <div className="lg:col-span-1 xl:col-span-1 flex flex-col gap-6">
            <ControlsPanel
              mode={mode}
              setMode={handleModeChange}
              threadCount={threadCount}
              setThreadCount={handleThreadCountChange}
              memoryBufferSize={memoryBufferSize}
              setMemoryBufferSize={handleMemoryBufferSizeChange}
              isRunning={isRunning}
            />
            <div className="hidden xl:block">
              <Concepts />
            </div>
        </div>

        {/* Middle Column: Simulation and Metrics */}
        <div className="lg:col-span-2 xl:col-span-2 flex flex-col gap-6">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4">Visual Simulation</h2>
            <SimulationCanvas 
                mode={mode}
                threadCount={threadCount}
                memoryBufferSize={memoryBufferSize}
                onSimulationComplete={handleSimulationComplete}
                setFps={setFps}
                isRunning={isRunning}
                setIsRunning={setIsRunning}
            />
            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Render Time</p>
                <p className="text-2xl font-mono font-bold text-green-accent">
                    {lastRenderTime !== null ? `${lastRenderTime.toFixed(0)} ms` : '-'}
                </p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Live FPS</p>
                <p className={`text-2xl font-mono font-bold ${isRunning ? 'text-blue-accent animate-pulse-fast' : 'text-blue-accent'}`}>
                    {isRunning ? fps.toFixed(1) : '0.0'}
                </p>
              </div>
            </div>
          </div>
           <div className="xl:hidden">
              <Concepts />
            </div>
        </div>
        
        {/* Right Column: Worksheet */}
        <div className="lg:col-span-3 xl:col-span-1">
          <Worksheet 
            answers={answers} 
            setAnswers={setAnswers} 
            onMarkWithAI={handleMarkWithAI}
            isMarking={isMarking}
            />
        </div>

      </main>
      
      {showResultsModal && aiResult && (
        <ResultsModal 
          results={aiResult}
          onClose={() => setShowResultsModal(false)}
          onDownload={handleDownloadReport}
        />
      )}
    </div>
  );
};

export default App;
