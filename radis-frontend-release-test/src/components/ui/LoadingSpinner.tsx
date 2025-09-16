import React from 'react';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface LoadingSpinnerProps {
    size?: SpinnerSize;
    text?: string;
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
                                                           size = 'md',
                                                           text,
                                                           className = ''
                                                       }) => {
    const sizeClasses = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-4',
        lg: 'w-12 h-12 border-4',
    };

    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <div
                className={`animate-spin rounded-full border-gray-300 border-t-cyan-600 ${sizeClasses[size]}`}
                role="status"
            >
                <span className="sr-only">Yükleniyor...</span>
            </div>
            {text && <p className="mt-3 text-gray-600 dark:text-gray-400">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;