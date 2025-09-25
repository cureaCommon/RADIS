import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllExaminations } from '../../api/apiService';
import SearchInput from '../ui/SearchInput';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import { ChevronRight } from 'lucide-react';
import type { Examination } from '../../types';
import { normalizeTurkish } from "../../utils/stringUtils.ts";

interface ExamSelectionProps {
    onExamSelect: (exam: Examination) => void;
}

const ExamSelection: React.FC<ExamSelectionProps> = ({ onExamSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const {
        data: allExaminations,
        error,
        status,
        refetch
    } = useQuery({
        queryKey: ['allExaminations'],
        queryFn: getAllExaminations,
    });

    const filteredExams = useMemo(() => {
        const examinations = allExaminations ?? [];
        if (!searchQuery) {
            return examinations;
        }
        const normalizedQuery = normalizeTurkish(searchQuery);
        return examinations.filter((exam) => {
            const normalizedName = normalizeTurkish(exam.name);
            const normalizedCode = exam.code ? normalizeTurkish(exam.code) : '';
            return normalizedName.includes(normalizedQuery) || normalizedCode.includes(normalizedQuery);
        });
    }, [allExaminations, searchQuery]);

    const handleSelectExam = (exam: Examination) => {
        onExamSelect(exam);
    };

    if (status === 'pending') {
        return <div className="py-12 flex justify-center"><LoadingSpinner text="Tüm tetkikler yükleniyor..."/></div>;
    }

    if (status === 'error') {
        return <ErrorMessage error={error} onRetry={refetch} />;
    }

    return (
        <div className="py-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
                Tetkik Seçimi
            </h1>

            <div className="mb-6">
                <SearchInput
                    placeholder="Tetkik adı veya koduna göre ara"
                    onSearch={setSearchQuery}
                />
            </div>

            <div
                className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
                <div
                    className="grid grid-cols-12 py-3 px-4 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 text-sm font-medium">
                    <div className="col-span-2 text-gray-600 dark:text-gray-300">SUT Kodu</div>
                    <div className="col-span-9 text-gray-600 dark:text-gray-300">Tetkik Adı</div>
                    <div className="col-span-1"></div>
                </div>

                <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                    {filteredExams.length === 0 ? (
                        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                            {searchQuery ? `"${searchQuery}" ile eşleşen tetkik bulunamadı` : 'Listelenecek tetkik bulunamadı.'}
                        </div>
                    ) : (
                        filteredExams.map((exam) => (
                            <div
                                key={exam.id}
                                className="grid grid-cols-12 items-center py-3 px-4 border-b border-gray-200 gap-4 dark:border-gray-700 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-750"
                                onClick={() => handleSelectExam(exam)}
                            >
                                <div
                                    className="col-span-2 text-gray-600 dark:text-gray-300 truncate"
                                    title={exam.code || ''}
                                >
                                    {exam.code || '-'}
                                </div>
                                <div className="col-span-9 text-gray-800 dark:text-gray-200">{exam.name}</div>
                                <div className="col-span-1 flex justify-end">
                                    <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-600"/>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExamSelection;