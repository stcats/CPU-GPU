
import React, { useRef, useEffect, useCallback } from 'react';
import { ExecutionMode } from '../types';

interface SimulationCanvasProps {
  mode: ExecutionMode;
  threadCount: number;
  memoryBufferSize: number;
  onSimulationComplete: (time: number) => void;
  setFps: (fps: number) => void;
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
}

const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = 256;
const PIXEL_COUNT = CANVAS_WIDTH * CANVAS_HEIGHT;

const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  mode,
  threadCount,
  memoryBufferSize,
  onSimulationComplete,
  setFps,
  isRunning,
  setIsRunning,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // FIX: Explicitly initialize useRef with null for better type safety and to prevent potential downstream errors.
  const animationFrameId = useRef<number | null>(null);
  const lastTime = useRef<number>(0);
  const startTime = useRef<number>(0);

  const draw = useCallback((ctx: CanvasRenderingContext2D, pixels: { x: number, y: number, color: [number, number, number] }[]) => {
    pixels.forEach(p => {
        ctx.fillStyle = `rgb(${p.color[0]}, ${p.color[1]}, ${p.color[2]})`;
        ctx.fillRect(p.x, p.y, 1, 1);
    });
  }, []);

  const resetCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#161b22';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    return ctx;
  }, []);

  const runSimulation = useCallback(() => {
    const ctx = resetCanvas();
    if (!ctx) return;

    setIsRunning(true);
    let processedPixels = 0;
    startTime.current = performance.now();
    lastTime.current = startTime.current;

    const processingColor: [number, number, number] = [255, 193, 7]; 
    const finalColor: [number, number, number] = [88, 166, 255]; 

    const animate = (timestamp: number) => {
        const deltaTime = timestamp - lastTime.current;
        lastTime.current = timestamp;
        if (deltaTime > 0) {
            setFps(1000 / deltaTime);
        }

        if (processedPixels >= PIXEL_COUNT) {
            onSimulationComplete(performance.now() - startTime.current);
            setIsRunning(false);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            return;
        }

        let pixelsToProcess: { x: number, y: number, color: [number, number, number] }[] = [];
        let pixelsToFinalize: { x: number, y: number, color: [number, number, number] }[] = [];
        
        let workPerFrame = 0;
        if (mode === ExecutionMode.CPU) {
            workPerFrame = 200; // Simulates slow, serial processing
        } else {
            const threadFactor = threadCount / 32;
            const bufferFactor = memoryBufferSize / 16;
            // Simplified model where both factors contribute to throughput
            workPerFrame = Math.floor(threadFactor * bufferFactor * 50);
        }

        for (let i = 0; i < workPerFrame && processedPixels < PIXEL_COUNT; i++) {
            let x, y;
            if (mode === ExecutionMode.CPU) {
                const pixelIndex = processedPixels;
                x = pixelIndex % CANVAS_WIDTH;
                y = Math.floor(pixelIndex / CANVAS_WIDTH);
            } else { // GPU simulates parallel access by picking random pixels
                x = Math.floor(Math.random() * CANVAS_WIDTH);
                y = Math.floor(Math.random() * CANVAS_HEIGHT);
            }
            
            pixelsToProcess.push({ x, y, color: processingColor });
            pixelsToFinalize.push({ x, y, color: finalColor });
            processedPixels++;
        }
        
        draw(ctx, pixelsToProcess);
        
        // Simulate a slight delay before finalizing the color to make the process visible
        setTimeout(() => {
            draw(ctx, pixelsToFinalize);
        }, mode === ExecutionMode.CPU ? 50 : 10);


        animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);
  }, [mode, threadCount, memoryBufferSize, setIsRunning, setFps, onSimulationComplete, draw, resetCanvas]);
  
  useEffect(() => {
    resetCanvas();
  }, [resetCanvas]);
  
  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 shadow-md">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="w-full h-auto rounded"
        />
      </div>
      <button
        onClick={runSimulation}
        disabled={isRunning}
        className="mt-4 w-full px-4 py-2 bg-green-accent text-white font-bold rounded-lg shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        {isRunning ? 'Running Simulation...' : 'Start Simulation'}
      </button>
    </div>
  );
};

export default SimulationCanvas;
