import React from 'react';
import {useRadis} from '../../../context/RadisContext';
import {ArrowLeft} from 'lucide-react';
import PrimerIndicationsPanel from './PrimerIndicationsPanel';
import VariantsPanel from './VariantsPanel';

const ClinicalIndication: React.FC = () => {
    const {
        state,
        setStep,
    } = useRadis();

    const handleBackClick = () => {
        setStep(1);
    };

    return (
        <div className="p-6 mt-4 max-w-4xl mx-auto bg-gray-50 dark:bg-gray-900">
            <div className="mb-8 bg-white dark:bg-gray-800 overflow-hidden">
                <div
                    className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 px-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Klinik Detaylar
                    </h3>
                </div>
                <div className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Seçili Tetkik:
                        </span>
                        <div
                            className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-cyan-100 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-200 border border-cyan-200 dark:border-cyan-700">
                            {state.selectedExam?.name || 'Tetkik seçilmedi'} ({state.selectedExam?.code || 'Kod bulunamadı'})
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PrimerIndicationsPanel/>
                <VariantsPanel/>
            </div>

            <div className="mt-6 flex justify-start">
                <button
                    onClick={handleBackClick}
                    className="group flex cursor-pointer items-center px-4 py-2 rounded-lg font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200
                    hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-cyan-600 dark:hover:border-cyan-400 transition-colors">
                    <ArrowLeft
                        className="mr-2 w-4 h-4 text-gray-700 dark:text-gray-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors"
                        strokeWidth={2}
                    />
                    <span className="group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        Geri
                    </span>
                </button>
            </div>
        </div>
    );
};

export default ClinicalIndication;
