import React from 'react';
import {useRadis} from '../../context/RadisContext';

const ProgressBar: React.FC = () => {
    const {state, setStep} = useRadis();
    const {step} = state;

    const steps = [
        {number: 1, name: 'Tetkik Seçimi'},
        {number: 2, name: 'Klinik Detaylar'},
        {number: 3, name: 'Uygunluk'}
    ];

    return (
        <div
            className="py-4 px-6 bg-gray-50 dark:bg-gray-900 border-b shadow-sm border-gray-200 dark:border-gray-700 max-w-4xl mx-auto ">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between">
                    {steps.map((s, index) => (
                        <React.Fragment key={s.number}>
                            <div className="flex flex-col items-center ">
                                <button
                                    onClick={() => {
                                        if (s.number < step) {
                                            setStep(s.number);
                                        }
                                    }}
                                    disabled={s.number > step || s.number === 1}
                                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-200
                                        ${s.number <= step ? 'bg-cyan-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}
                                        ${s.number > step || s.number === 1 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    {s.number}
                                </button>
                                <span
                                    className={`mt-2 text-sm ${s.number === step ? 'text-cyan-600 dark:text-cyan-400 font-medium' :
                                        'text-gray-500 dark:text-gray-400'}`}>
                  {s.name}
                </span>
                            </div>

                            {index < steps.length - 1 && (
                                <div className={`flex-1 h-1 mx-2 
                  ${step > index + 1 ? 'bg-cyan-600' :
                                    'bg-gray-200 dark:bg-gray-700'}`}>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;