import React, {useState} from 'react';
import {Info, ShieldCheck, AlertTriangle, Zap} from 'lucide-react';
import type {ScoringResult} from '../../types';

interface ScoreCardProps {
    result: ScoringResult;
    onSelect: () => void;
}

const ScoreCard: React.FC<ScoreCardProps> = ({result, onSelect}) => {
    const [showLiteratureSummary, setShowLiteratureSummary] = useState(false);

    const getScoreColor = (score: number) => {
        if (score < 4) return 'bg-gradient-to-br from-red-400 to-red-500';
        if (score < 7) return 'bg-gradient-to-br from-amber-400 to-orange-500';
        return 'bg-gradient-to-br from-green-400 to-green-500';
    };

    const getScoreBorderColor = (score: number) => {
        if (score < 4) return 'ring-red-200 dark:ring-red-700';
        if (score < 7) return 'ring-amber-200 dark:ring-orange-700';
        return 'ring-emerald-200 dark:ring-green-700';
    };


    const getRadiationInfo = (rrlString: string) => {
        if (!rrlString) return null;

        if (rrlString.includes('O 0 mSv')) {
            return {
                level: 'none',
                text: 'Risk yok',
                icon: ShieldCheck,
                bgColor: 'bg-green-100 dark:bg-green-900/30',
                textColor: 'text-green-700 dark:text-green-300',
                iconColor: 'text-green-600 dark:text-green-400',
                badge: 'Güvenli'
            };
        } else if (rrlString.includes('☢☢☢☢')) {
            return {
                level: 'high',
                text: '10-30 mSv',
                icon: Zap,
                bgColor: 'bg-red-100 dark:bg-red-900/30',
                textColor: 'text-red-700 dark:text-red-300',
                iconColor: 'text-red-600 dark:text-red-400',
                badge: 'Yüksek'
            };
        } else if (rrlString.includes('☢☢☢')) {
            return {
                level: 'moderate',
                text: '1-10 mSv',
                icon: AlertTriangle,
                bgColor: 'bg-amber-100 dark:bg-amber-900/30',
                textColor: 'text-amber-700 dark:text-amber-300',
                iconColor: 'text-amber-600 dark:text-amber-400',
                badge: 'Orta'
            };
        }

        return {
            level: 'unknown',
            text: rrlString,
            icon: ShieldCheck,
            bgColor: 'bg-gray-100 dark:bg-gray-800',
            textColor: 'text-gray-700 dark:text-gray-300',
            iconColor: 'text-gray-600 dark:text-gray-400',
            badge: 'Unknown'
        };
    };

    const radiationInfo = result.adultRRL ? getRadiationInfo(result.adultRRL) : null;

    return (
        <div className={`border rounded-xl p-3 mb-2 transition-all duration-200 ${
            result.isSelected
                ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/30 dark:border-cyan-700 shadow-lg'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
        }`}>
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-md">{result.name}</h3>
                        {result.literatureSummary && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowLiteratureSummary(!showLiteratureSummary);
                                }}
                                className="cursor-pointer ml-2 text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                            >
                                <Info size={18}/>
                            </button>
                        )}
                    </div>


                    {radiationInfo && (
                        <div
                            className={`mt-2 inline-flex items-center px-2 py-1 rounded-lg ${radiationInfo.bgColor} transition-all duration-200`}>
                            <radiationInfo.icon
                                size={16}
                                className={`mr-1 ${radiationInfo.iconColor}`}
                            />
                            <div className="flex items-center ">
                                <span className={`text-xs font-small mr-1 ${radiationInfo.textColor}`}>
                                    Radyasyon:
                                </span>
                                <span className={`text-xs font-bold mr-1 ${radiationInfo.textColor}`}>
                                    {radiationInfo.text}
                                </span>
                                <span
                                    className={`text-xs px-2 py-1 rounded-lg bg-white/60 dark:bg-black/20 ${radiationInfo.textColor} font-medium`}>
                                    {radiationInfo.badge}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-center ml-6">
                    <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-md  ${getScoreColor(result.rating)} ${getScoreBorderColor(result.rating)} transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
                        <span className="drop-shadow-sm">{Number(result.rating) % 1 === 0
                            ? Number(result.rating)
                            : Number(result.rating).toFixed(1)}</span>
                    </div>
                    <div className="mt-3">
                        <button
                            onClick={onSelect}
                            className={`px-3 py-2 cursor-pointer text-sm font-medium rounded-lg transition-all duration-200 ${
                                result.isSelected
                                    ? 'bg-cyan-600 text-white shadow-lg hover:bg-cyan-700'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 hover:shadow-md'
                            }`}
                        >
                            {result.isSelected ? 'Seçildi' : 'Seç'}
                        </button>
                    </div>
                </div>
            </div>

            {result.shortJustification && (
                <div
                    className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                    {result.shortJustification}
                </div>
            )}

            {showLiteratureSummary && result.literatureSummary && (
                <div
                    className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 text-sm max-h-52 overflow-y-auto">
                    {result.literatureSummary}
                </div>
            )}
        </div>
    );
};

export default ScoreCard;