
import React from 'react';
import { ExecutionMode } from '../types';
import { CpuChipIcon, GpuChipIcon } from './icons';

interface ControlsPanelProps {
  mode: ExecutionMode;
  setMode: (mode: ExecutionMode) => void;
  threadCount: number;
  setThreadCount: (count: number) => void;
  memoryBufferSize: number;
  setMemoryBufferSize: (size: number) => void;
  isRunning: boolean;
}

const Slider: React.FC<{ label: string; value: number; min: number; max: number; step: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, disabled: boolean, unit: string }> = 
({ label, value, min, max, step, onChange, disabled, unit }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <div className="flex items-center space-x-4">
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
            />
            <span className="text-blue-accent font-mono w-16 text-right">{value} {unit}</span>
        </div>
    </div>
);


const ControlsPanel: React.FC<ControlsPanelProps> = ({
  mode,
  setMode,
  threadCount,
  setThreadCount,
  memoryBufferSize,
  setMemoryBufferSize,
  isRunning
}) => {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 space-y-6 shadow-lg">
      <h2 className="text-xl font-bold text-white">Simulation Controls</h2>

      {/* Execution Mode Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Execution Mode</label>
        <div className="flex items-center bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setMode(ExecutionMode.CPU)}
            disabled={isRunning}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-semibold transition-colors disabled:cursor-not-allowed ${mode === ExecutionMode.CPU ? 'bg-blue-accent text-white' : 'text-gray-300 hover:bg-gray-700'}`}
          >
            <CpuChipIcon />
            <span>CPU (Serial)</span>
          </button>
          <button
            onClick={() => setMode(ExecutionMode.GPU)}
            disabled={isRunning}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-semibold transition-colors disabled:cursor-not-allowed ${mode === ExecutionMode.GPU ? 'bg-blue-accent text-white' : 'text-gray-300 hover:bg-gray-700'}`}
          >
            <GpuChipIcon />
            <span>GPU (Parallel)</span>
          </button>
        </div>
      </div>
      
      {/* Parameter Sliders */}
      <div className="space-y-4">
        <Slider 
            label="Thread Count (Simulates Core Count)"
            value={threadCount}
            min={32}
            max={4096}
            step={32}
            onChange={(e) => setThreadCount(parseInt(e.target.value))}
            disabled={isRunning || mode === ExecutionMode.CPU}
            unit="threads"
        />
        <Slider 
            label="Memory Buffer Size (Simulates Throughput)"
            value={memoryBufferSize}
            min={16}
            max={1024}
            step={16}
            onChange={(e) => setMemoryBufferSize(parseInt(e.target.value))}
            disabled={isRunning || mode === ExecutionMode.CPU}
            unit="KB"
        />
      </div>
    </div>
  );
};

export default ControlsPanel;
