// components/steps/ClinicalIndication/PrimerIndicationsPanel.tsx
import React, {useEffect, useMemo, useState} from 'react';
import SearchInput from '../../ui/SearchInput';
import LoadingSpinner from '../../ui/LoadingSpinner';
import ErrorMessage from '../../ui/ErrorMessage';
import {useRadis} from '../../../context/RadisContext';
import {type InfiniteData, useInfiniteQuery} from '@tanstack/react-query';
import {getPrimaryIndication} from '../../../api/apiService';
import useDebounce from '../../../hooks/useDebounce';
import {useInView} from 'react-intersection-observer';
import type {
    Page,
    ClinicalIndication as ClinicalIndicationType,
    Indication
} from '../../../types';

const PrimerIndicationsPanel: React.FC = () => {
    const {state, setSelectedIndication, setSelectedVariant, switchToManualOverride} = useRadis();
    const [indicationQuery, setIndicationQuery] = useState('');
    const debouncedIndicationQuery = useDebounce(indicationQuery, 500);
    const {ref, inView} = useInView();

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        refetch
    } = useInfiniteQuery<
        Page<Indication>,
        Error,
        InfiniteData<Page<Indication>>,
        (string | undefined)[],
        number
    >({
        queryKey: ['primaryIndications', debouncedIndicationQuery],
        queryFn: ({pageParam = 0}) =>
            getPrimaryIndication({pageParam, query: debouncedIndicationQuery}),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.last ? undefined : lastPage.number + 1,
    });

    useEffect(() => {
        if (inView && hasNextPage) fetchNextPage();
    }, [inView, hasNextPage, fetchNextPage]);

    const indications = useMemo(() => {
        const pages = data?.pages ?? [];
        return pages.flatMap(page =>
            page.content.map(indication => ({
                id: indication.id,
                name: indication.name,
                isCustom: false
            }))
        );
    }, [data]);

    const handleSelectIndication = (indication: ClinicalIndicationType) => {
        setSelectedIndication(indication);
        setSelectedVariant(null);
    };

    if (status === 'pending') {
        return <LoadingSpinner text="Endikasyonlar yükleniyor..."/>;
    }

    if (status === 'error') {
        return <ErrorMessage error={error} onRetry={refetch}/>;
    }

    return (
        <div>
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
                Primer Endikasyon
            </h2>
            <div className="mb-4">
                <SearchInput
                    placeholder="Primer Endikasyonları ara"
                    value={indicationQuery}
                    onSearch={setIndicationQuery}
                    autoFocus
                />
            </div>
            <div
                className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto">
                {indications.length === 0 ? (
                    <div className="py-6 text-center text-gray-500 dark:text-gray-400">
                        {debouncedIndicationQuery
                            ? `"${debouncedIndicationQuery}" ile eşleşen endikasyon bulunamadı`
                            : 'Listelenecek endikasyon yok.'}
                        <div className="mt-4">
                            <button
                                onClick={switchToManualOverride}
                                className="px-4 cursor-pointer py-2 text-sm font-medium text-cyan-700 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-900/50 rounded-lg hover:bg-cyan-200 dark:hover:bg-cyan-800/50 transition-colors"
                            >
                                Seçim Yapmadan İlerle
                            </button>
                        </div>
                    </div>
                ) : (
                    indications.map((indication) => (
                        <div
                            key={indication.id}
                            className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 last:border-0 cursor-pointer transition-colors flex items-center ${
                                state.selectedIndication?.id === indication.id
                                    ? 'bg-cyan-50 dark:bg-cyan-900/30'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-750'
                            }`}
                            onClick={() => handleSelectIndication(indication)}
                        >
                            <div className="flex-1">
                                <div className="text-gray-800 dark:text-gray-200">{indication.name}</div>
                                {indication.isCustom && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Kullanıcı
                                        Tanımlı</div>
                                )}
                            </div>
                            <div className={`w-5 h-5 rounded-full border ${
                                state.selectedIndication?.id === indication.id
                                    ? 'border-cyan-600 bg-cyan-600 dark:border-cyan-500 dark:bg-cyan-500'
                                    : 'border-gray-300 dark:border-gray-600'
                            }`}>
                                {state.selectedIndication?.id === indication.id && (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
                <div ref={ref} className="h-1 flex justify-center items-center">
                    {isFetchingNextPage && <LoadingSpinner size="sm"/>}
                </div>
            </div>
        </div>
    );
};

export default PrimerIndicationsPanel;
