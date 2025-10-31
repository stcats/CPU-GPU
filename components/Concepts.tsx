
import React from 'react';
import { InfoIcon, ExternalLinkIcon } from './icons';

const concepts = [
    {
        title: "Parallel vs. Serial Execution",
        content: "CPUs typically execute tasks serially, one after another, which is great for complex, sequential tasks (high latency). GPUs use thousands of simpler cores to execute many tasks in parallel, ideal for repetitive tasks like rendering graphics (high throughput)."
    },
    {
        title: "Throughput vs. Latency",
        content: "Latency is the time to complete a single task. Throughput is the number of tasks completed in a given time. CPUs are latency-optimized (a fast car). GPUs are throughput-optimized (a fleet of buses)."
    },
    {
        title: "Memory Bandwidth",
        content: "This is the rate at which data can be read from or stored into memory. High bandwidth is crucial for GPUs because their parallel cores need to be fed vast amounts of data (like textures and vertices) simultaneously to avoid stalling."
    },
    {
        title: "Matrix & Vector Operations",
        content: "Graphics and scientific computing heavily rely on these math operations. Each calculation can be done independently, making them perfectly suited for the GPU's parallel architecture. A GPU can compute thousands of these operations at once.",
        link: {
            url: 'http://matrixmultiplication.xyz/',
            text: 'See it in action'
        }
    },
    {
        title: "CPUs vs. GPUs",
        content: "CPUs are general-purpose processors designed for flexibility, handling everything from your OS to this web app. GPUs are specialized accelerators designed to do one thing exceptionally well: process huge amounts of parallel data."
    }
];

const Concepts: React.FC = () => {
    return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 space-y-4 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4">Core Concepts</h2>
            {concepts.map(concept => (
                <div key={concept.title} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <h3 className="font-semibold text-blue-accent"><InfoIcon />{concept.title}</h3>
                    <p className="text-sm text-gray-400 mt-2">
                        {concept.content}
                        {concept.link && (
                            <a href={concept.link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-accent hover:underline ml-2 font-semibold">
                                {concept.link.text} <ExternalLinkIcon />
                            </a>
                        )}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default Concepts;
