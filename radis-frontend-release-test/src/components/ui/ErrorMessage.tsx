import React from 'react';
import {RefreshCw} from 'lucide-react';

interface ErrorMessageProps {
    message?: string;
    error?: Error | null;
    onRetry?: () => void;
    className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
                                                       message = 'Bir Sorun Oluştu',
                                                       error,
                                                       onRetry,
                                                       className = ''
                                                   }) => {
    return (
        <div
            className={`flex flex-col items-center justify-center text-center p-8 ${className}`}
            role="alert"
        >


            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                {message}
            </h2>

            {error?.message && (
                <p className="mt-2 max-w-md text-gray-500 dark:text-gray-400">
                    {error.message}
                </p>
            )}

            {onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-8 cursor-pointer flex items-center px-6 py-2 rounded-full font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-750 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:focus:ring-offset-gray-900"
                >
                    <RefreshCw className="w-4 h-4 mr-2 "/>
                    Tekrar Dene
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;