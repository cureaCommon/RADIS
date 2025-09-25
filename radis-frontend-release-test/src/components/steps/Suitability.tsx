import React, {useEffect, useMemo, useState} from 'react';
import {useRadis} from '../../context/RadisContext';
import ScoreCard from '../ui/ScoreCard';
import {ArrowLeft, ArrowRight, Check} from 'lucide-react';
import {getSecondaryIndications, getImagingCombinationDetails, submitDiagnosis} from "../../api/apiService.ts";
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import {useMutation, useQuery} from "@tanstack/react-query";
import type {DiagnosisPayload, ImagingCombinationDetail, ScoringResult, VariantDetail} from "../../types";

const MANUAL_REASONS = [
    {value: 'INDICATION_NOT_FOUND', label: 'Aradığım primer endikasyon listede yok.'},
    {value: 'VARIANT_NOT_FOUND', label: 'Seçtiğim endikasyona uygun bir detay (varyant) bulamadım.'},
    {value: 'RECOMMENDATION_MISMATCH', label: 'Önerilen tetkikler, istediğim tetkik ile eşleşmiyor.'},
    {value: 'OTHER', label: 'Diğer'},
];
const Suitability: React.FC = () => {
    const {
        patient,
        state,
        setStep,
        setScoringResults,
        toggleSelectedResult,
        switchToManualOverride

    } = useRadis();

    const [manualReason, setManualReason] = useState('');
    const [manualComment, setManualComment] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [finalMessage, setFinalMessage] = useState('');

    const isCommentValid = useMemo(() => {
        return manualComment.trim().split(/\s+/).filter(Boolean).length >= 3;
    }, [manualComment]);

    const diagnosisMutation = useMutation({
        mutationFn: submitDiagnosis,
        onSuccess: () => {
            setFinalMessage("Tetkik isteği başarıyla oluşturuldu ve ilgili birime iletildi.");
            setFeedbackSubmitted(true);
            setShowSuccess(true);
            setManualReason('');
            setManualComment('');

        },
        onError: (error) => {
            console.error('Tanı gönderme hatası:', error);
            setFinalMessage(`Hata: ${error.message}`);
            setFeedbackSubmitted(true);
            setShowSuccess(true);
        },
    });


    const {
        data: variantDetail,
        isPending: isVariantDetailLoading,
        error: variantDetailError,
        refetch: refetchVariantDetail
    } = useQuery<VariantDetail, Error>({
        queryKey: ['variantDetail', state.selectedVariant?.id],
        queryFn: () => getSecondaryIndications({variantId: state.selectedVariant!.id}),
        enabled: !!state.selectedVariant && !state.isManualSelection,
    });

    const {
        data: finalDetails,
        isPending: areDetailsLoading,
        error: detailsError,
        refetch: refetchDetails
    } = useQuery<ImagingCombinationDetail[], Error>({
        queryKey: ['combinationDetails', variantDetail?.id],
        queryFn: () => {
            const combinationIds = variantDetail!.imagingCombinations.map(ic => ic.id);
            return getImagingCombinationDetails(combinationIds);
        },
        enabled: !!variantDetail && !state.isManualSelection,

    });
    const isLoading = isVariantDetailLoading || areDetailsLoading;
    const error = variantDetailError || detailsError;
    const refetch = variantDetailError ? refetchVariantDetail : refetchDetails;

    useEffect(() => {
        if (finalDetails && !state.isManualSelection) {
            const examCodeToMatch = state.selectedExam?.code;

            let defaultSelectedItem: ImagingCombinationDetail | undefined = undefined;

            if (examCodeToMatch) {
                defaultSelectedItem = finalDetails.find(detail =>
                    detail.imagingTypes.some(imagingType => imagingType.code === examCodeToMatch)
                );
            }


            const newResults: ScoringResult[] = finalDetails.map(apiResult => {

                const procedureName = apiResult.imagingTypes.map(it => it.name).join(' + ');

                return {
                    id: apiResult.id,
                    name: procedureName,
                    rating: apiResult.rating,
                    literatureSummary: apiResult.literatureSummary,
                    isSelected: apiResult.id === defaultSelectedItem?.id,
                    variantId: state.selectedVariant!.id,
                    adultRRL: apiResult.adultRRL,
                    shortJustification: apiResult.shortJustification
                };
            });

            setScoringResults(newResults);
        }
    }, [finalDetails, state.isManualSelection, state.selectedExam, state.selectedVariant, setScoringResults]);


    const selectedResult = state.scoringResults.find(result => result.isSelected);

    const handleBackClick = () => {
        setStep(2);
    };

    const handleContinueClick = () => {
        setShowSuccess(true);
    };

    const handleFinalSubmit = () => {
        if (!state.selectedIndication?.id || !state.selectedVariant?.id || !selectedResult?.id) {
            setFinalMessage("Eksik bilgi nedeniyle işlem yapılamadı. Lütfen adımları kontrol edin.");
            setFeedbackSubmitted(true);
            return;
        }

        const payload: DiagnosisPayload = {
            primarySymptomId: state.selectedIndication.id,
            secondarySymptomId: state.selectedVariant.id,
            selectedImagingCombinationId: selectedResult.id,
            comment: feedback.trim(),
            doctorName: patient?.doctorName || 'Bilinmiyor',
            hospitalName: patient?.hospitalName || 'Bilinmiyor'
        };

        diagnosisMutation.mutate(payload);
    };
    const handleManualSubmit = () => {
        if (!manualReason || !manualComment) {
            alert("Lütfen devam etmek için bir kategori seçin ve açıklama girin.");
            return;
        }
        if (!isCommentValid) {
            alert("Lütfen en az 3 kelimeden oluşan bir açıklama girin.");
            return;
        }

        const payload: DiagnosisPayload = {
            primarySymptomId: state.selectedIndication?.id || null,
            secondarySymptomId: state.selectedVariant?.id || null,
            selectedImagingCombinationId: null,
            selectedImagingTypeId: state.selectedExam?.id || null,
            reason: manualReason,
            comment: manualComment.trim(),
            doctorName: patient?.doctorName || 'Bilinmiyor',
            hospitalName: patient?.hospitalName || 'Bilinmiyor'
        };

        diagnosisMutation.mutate(payload);
    };

    const getRatingColor = (rating: number) => {
        if (rating < 4) return 'from-rose-400 to-red-500';
        if (rating < 7) return 'from-amber-300 to-amber-500';
        return 'from-emerald-300 to-emerald-500';
    };

    const getRatingTextColor = (rating: number) => {
        if (rating < 4) return 'text-red-700';
        if (rating < 7) return 'text-amber-700';
        return 'text-emerald-700';
    };


    if (state.isManualSelection) {
        if (!feedbackSubmitted) {
            return (
                <div className="py-6 max-w-4xl mx-auto">
                    <div
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Klinik Not ve
                            Talep</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Lütfen isteğinizin
                            nedenini ve detaylarını belirtin.
                        </p>

                        <div
                            className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                            <span
                                className="text-sm font-medium text-gray-500 dark:text-gray-400">İstenen Tetkik:</span>
                            <p className="font-semibold text-base text-cyan-800 dark:text-cyan-200 mt-1">
                                {state.selectedExam?.name || 'Tetkik seçilmedi'} ({state.selectedExam?.code || 'Kod bulunamadı'})
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="manualReason"
                                       className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Gerekçe Kategorisi <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="manualReason"
                                    value={manualReason}
                                    onChange={(e) => setManualReason(e.target.value)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                >
                                    <option value="" disabled>Lütfen bir kategori seçiniz</option>
                                    {MANUAL_REASONS.map(reason => (
                                        <option key={reason.value} value={reason.value}>{reason.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="manualComment"
                                       className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Açıklama / Klinik Bilgi <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="manualComment"
                                    value={manualComment}
                                    onChange={(e) => setManualComment(e.target.value)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    rows={4}
                                    placeholder="Sistem önerileri dışında tetkik isteme nedeninizi ve ilgili klinik bilgileri bu alana giriniz."
                                />
                                {manualComment.length > 0 && !isCommentValid && (
                                    <p className="text-xs text-red-500 mt-1">
                                        Açıklama en az 3 kelime olmalıdır.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-between">
                            <button onClick={handleBackClick} className="group flex cursor-pointer items-center px-4 py-2 rounded-lg font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200
                    hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-cyan-600 dark:hover:border-cyan-400 transition-colors">
                                <ArrowLeft
                                    className="mr-2 w-4 h-4 text-gray-700 dark:text-gray-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors"
                                    strokeWidth={2}
                                />
                                <span
                                    className="group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                Geri
                            </span>
                            </button>
                            <button
                                onClick={handleManualSubmit}
                                disabled={!manualReason || !manualComment || diagnosisMutation.isPending}
                                className="flex cursor-pointer items-center px-4 py-2 rounded-lg font-medium bg-cyan-600 text-white hover:bg-cyan-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {diagnosisMutation.isPending ? <LoadingSpinner size="sm"/> : ' Gönder'}
                            </button>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="p-6 mt-4 max-w-4xl mx-auto bg-white dark:bg-gray-900">
                    <div
                        className="bg-white dark:bg-gray-800 p-6 shadow border border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div
                                className={`w-16 h-16 rounded-full ${diagnosisMutation.isError ? 'bg-red-100' : 'bg-green-100'} flex items-center justify-center`}>
                                {diagnosisMutation.isError ?
                                    <span className="text-2xl font-bold text-red-600">X</span> :
                                    <Check className="w-8 h-8 text-green-600"/>
                                }
                            </div>
                            <h2 className="text-2xl font-semibold ...">{diagnosisMutation.isError ? 'Hata Oluştu' : 'İstem Başarıyla Oluşturuldu'}</h2>
                            <p className="text-gray-600 dark:text-gray-400">{finalMessage}</p>
                        </div>
                    </div>
                </div>
            );
        }
    }

    if (isLoading) {
        return <div className="py-12 flex justify-center"><LoadingSpinner text="Uygunluk Skorları Hesaplanıyor..."/>
        </div>;
    }

    if (error) {
        return <ErrorMessage error={error} onRetry={refetch}/>;
    }


    return (

        <div className="py-6 max-w-4xl mx-auto">
            {!showSuccess ? (
                <>
                    <div className="px-2 py-4 ">
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

                    <div className="py-4 flex gap-4 ">

                        <div className="w-full md:w-4/12 flex flex-col gap-4">
                            <div
                                className="col-span-1 bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Seçilen
                                    Kriterler</h2>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded ">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Primer Endikasyon</p>
                                        <p className="font-medium text-cyan-800 dark:text-cyan-200">{state.selectedIndication?.name}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Endikasyon Detayı</p>
                                        <p className="font-medium text-cyan-800 dark:text-cyan-200">{state.selectedVariant?.name}</p>
                                    </div>
                                </div>
                            </div>

                            {selectedResult && (
                                <div
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 w-full border border-gray-200 dark:border-gray-700">
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                                            Uygunluk Skoru
                                        </h2>
                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center justify-between gap-4 w-full mb-2">
                                                {/* Skor barı */}
                                                <div className="flex-1">
                                                    <div
                                                        className="h-3 rounded-full bg-gray-200 dark:bg-gray-700 w-full">
                                                        <div
                                                            className={`h-full rounded-full bg-gradient-to-r ${getRatingColor(selectedResult.rating)}`}
                                                            style={{width: `${(selectedResult.rating / 10) * 100}%`}}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Skor değeri */}
                                                <div className="flex flex-col items-end min-w-[70px]  shrink-0">
  <span className={`text-3xl font-bold ${getRatingTextColor(Number(selectedResult.rating))}`}>
  {Number(selectedResult.rating) % 1 === 0
      ? Number(selectedResult.rating)
      : Number(selectedResult.rating).toFixed(1)}
</span>

                                                    <span
                                                        className={`text-xs ${getRatingTextColor(selectedResult.rating)} opacity-75`}>
      10 Üzerinden
    </span>
                                                </div>
                                            </div>

                                            {selectedResult.adultRRL && (
                                                <div className="w-full">
                                                    <div
                                                        className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                                                        <span className="text-sm text-gray-500 dark:text-gray-400">Radyasyon Seviyesi</span>
                                                        <span
                                                            className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                                         {selectedResult.adultRRL}
                                    </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-full md:w-8/12 overflow-y-auto max-h-[calc(100vh-300px)]">
                            {state.scoringResults.map((result) => (
                                <ScoreCard
                                    key={result.id}
                                    result={result}
                                    onSelect={() => toggleSelectedResult(result.id)}
                                />
                            ))}
                        </div>

                    </div>

                    {state.scoringResults.length > 0 && (
                        <div className="mt-4 p-4 border-t border-gray-200 dark:border-gray-700 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Aradığınız tetkik öneriler arasında yok mu?
                            </p>
                            <button onClick={switchToManualOverride}
                                    className="font-medium cursor-pointer text-cyan-600 dark:text-cyan-400 hover:underline">
                                Önerileri atla ve "{state.selectedExam?.name}" ile devam et
                            </button>
                        </div>
                    )}
                    <div className="mt-6 flex justify-between">
                        <button
                            onClick={handleBackClick}
                            className="group flex items-center cursor-pointer px-4 py-2 rounded-lg font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200
               hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-cyan-600 dark:hover:border-cyan-400 transition-colors"
                        >
                            <ArrowLeft
                                className="mr-2 w-4 h-4 text-gray-700 dark:text-gray-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors"
                                strokeWidth={2}
                            />
                            <span
                                className="group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                Geri
                            </span>
                        </button>

                        <button
                            onClick={handleContinueClick}
                            disabled={!selectedResult}
                            className="flex cursor-pointer items-center px-4 py-2 rounded-lg font-medium bg-cyan-600 text-white hover:bg-cyan-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2">
                                {/*<Check className="w-4 h-4 text-cyan-600" strokeWidth={3}/>*/}
                                <ArrowRight className="ml-2 w-4 h-4 text-white" strokeWidth={3}/>

                            </div>
                            Devam et
                        </button>


                    </div>
                </>
            ) : (
                <div
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 ">
                    {feedbackSubmitted && (

                        <div className="flex flex-col items-center text-center mb-6">
                            <div
                                className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                                <Check className="w-8 h-8 text-green-600 dark:text-green-400"/>
                            </div>

                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">İstem başarıyla
                                oluşturuldu</h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Tetkik isteği başarıyla oluşturuldu ve ilgili birime iletildi.
                            </p>
                        </div>
                    )}
                    {selectedResult && (
                        <div
                            className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 my-6">
                            <h3 className="text-lg font-semibold text-cyan-800 dark:text-cyan-200 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                                Tetkik Detayları
                            </h3>

                            <div className="flex flex-col md:flex-row gap-4 pt-2">

                                <div className="flex-1 space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Tetkik</p>
                                        <p className="font-semibold text-base text-gray-800 dark:text-gray-200">{selectedResult.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Primer Endikasyon</p>
                                        <p className="font-medium text-gray-800 dark:text-gray-200">{state.selectedIndication?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Endikasyon Detayı</p>
                                        <p className="font-medium text-gray-800 dark:text-gray-200">{state.selectedVariant?.name}</p>
                                    </div>
                                </div>

                                <div
                                    className="w-full md:w-48 md:pl-4 md:border-l border-gray-200 dark:border-gray-700 space-y-3">
                                    <div>
                                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Uygunluk
                                            Skoru</p>
                                        <div className="flex justify-between items-center mt-1">
                                            <span
                                                className={`text-xl font-bold ${getRatingTextColor(selectedResult.rating)}`}>{selectedResult.rating}/10</span>

                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Radyasyon
                                            Seviyesi</p>
                                        <div className="flex justify-start items-center mt-1">
                                            <span
                                                className="font-semibold text-base text-gray-800 dark:text-gray-200">{selectedResult.adultRRL}</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                    {!feedbackSubmitted ? (
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Geri Bildirim
                                (İsteğe Bağlı)</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                Geri bildiriminiz, önerilerimizi iyileştirmemize yardımcı olur.
                            </p>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                rows={3}
                                placeholder="Geri bildiriminizi buraya giriniz..."
                            ></textarea>
                            <div className="flex justify-end mt-2">
                                <button
                                    onClick={handleFinalSubmit}
                                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-cyan-600 text-white hover:bg-cyan-700 transition-colors"
                                >
                                    Gönder
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="mb-6 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm text-center">
                            {finalMessage}
                        </div>
                    )}

                </div>
            )}
        </div>
    );
};

export default Suitability;