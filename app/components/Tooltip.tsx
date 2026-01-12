'use client'

import { useState } from 'react';

interface TooltipProps {
    text: string;
}

export default function Tooltip({ text }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="relative inline-block ml-1">
            <button
                type="button"
                className="inline-flex items-center justify-center w-3.5 h-3.5 text-xs text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                onClick={() => setIsVisible(!isVisible)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-3.5 h-3.5"
                >
                    <path
                        fillRule="evenodd"
                        d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6.75 8a.75.75 0 0 0 0 1.5h.75v1.75a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8.25 8h-1.5Z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
            {isVisible && (
                <div className="absolute left-0 top-full mt-1 z-10 w-48 px-3 py-2 text-xs text-white bg-zinc-800 dark:bg-zinc-700 rounded-lg shadow-lg">
                    {text}
                    <div className="absolute -top-1 left-2 w-2 h-2 bg-zinc-800 dark:bg-zinc-700 rotate-45"></div>
                </div>
            )}
        </div>
    );
}
