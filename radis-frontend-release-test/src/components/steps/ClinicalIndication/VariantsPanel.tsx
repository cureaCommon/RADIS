import React, {useMemo, useState} from 'react';
import SearchInput from '../../ui/SearchInput';
import {useRadis} from '../../../context/RadisContext';
import {useQuery} from '@tanstack/react-query';
import {getIndicationDetails} from '../../../api/apiService';
import LoadingSpinner from '../../ui/LoadingSpinner';
import ErrorMessage from '../../ui/ErrorMessage';
import type {ClinicalVariant, PrimaryIndicationDetail} from '../../../types';

const VariantsPanel: React.FC = () => {
    const {state, setSelectedVariant, setStep, switchToManualOverride} = useRadis();
    const [variantQuery, setVariantQuery] = useState('');

    const {
        data: indicationDetail,
        status,
        error,
        refetch
    } = useQuery<PrimaryIndicationDetail, Error>({
        queryKey: ['indicationVariants', state.selectedIndication?.id],
        queryFn: () => getIndicationDetails({
            indicationId: state.selectedIndication!.id,
        }),
        enabled: !!state.selectedIndication,
    });

    const filteredVariants = useMemo(() => {
        const baseVariants = indicationDetail?.secondarySymptoms.map(variant => ({
            id: variant.id,
            name: variant.name,
            indicationId: indicationDetail.id,
            isCustom: false
        })) ?? [];

        if (!variantQuery) {
            return baseVariants;
        }

        return baseVariants.filter(variant =>
            variant.name.toLowerCase().includes(variantQuery.toLowerCase())
        );
    }, [indicationDetail, variantQuery]);


    const handleSelectVariant = (variant: ClinicalVariant) => {

        setSelectedVariant(variant);
        setStep(3);
    };

    return (
        <div
            className={`transition-opacity duration-300 ${state.selectedIndication ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
                Endikasyon Detayı
            </h2>
            <div className="mb-4">
                <SearchInput
                    placeholder="Endikasyon detaylarını ara"
                    value={variantQuery}
                    onSearch={setVariantQuery}
                />
            </div>
            <div
                className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto">
                {!state.selectedIndication ? (
                    <div className="py-6 text-center text-gray-500 dark:text-gray-400">
                        Henüz bir primer endikasyon seçilmedi.
                    </div>
                ) : status === 'pending' ? (
                    <div className="py-6 flex justify-center"><LoadingSpinner/></div>
                ) : status === 'error' ? (
                    <ErrorMessage error={error} onRetry={refetch}/>
                ) : filteredVariants.length === 0 ? (
                    <div className="py-6 text-center text-gray-500 dark:text-gray-400">
                        {variantQuery ? `"${variantQuery}" ile eşleşen detay bulunamadı` : 'Bu endikasyona ait detay bulunamadı.'}
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
                    filteredVariants.map((variant) => (
                        <div
                            key={variant.id}
                            className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 last:border-0 cursor-pointer transition-colors flex items-center ${
                                state.selectedVariant?.id === variant.id
                                    ? 'bg-cyan-50 dark:bg-cyan-900/30'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-750'
                            }`}
                            onClick={() => handleSelectVariant(variant)}
                        >
                            <div className="flex-1">
                                <div className="text-gray-800 dark:text-gray-200">{variant.name}</div>
                                {variant.isCustom && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Kullanıcı
                                        Tanımlı</div>
                                )}
                            </div>
                            <div className={`w-5 h-5 rounded-full border ${
                                state.selectedVariant?.id === variant.id
                                    ? 'border-cyan-600 bg-cyan-600 dark:border-cyan-500 dark:bg-cyan-500'
                                    : 'border-gray-300 dark:border-gray-600'
                            }`}>
                                {state.selectedVariant?.id === variant.id && (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default VariantsPanel;