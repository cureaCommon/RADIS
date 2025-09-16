import React, {createContext, useContext, useState, type ReactNode, useEffect, useCallback} from 'react';
import type {
    Examination,
    ClinicalIndication,
    ClinicalVariant,
    RadisState,
    ScoringResult,
    Patient
} from '../types';

interface RadisContextType {
    state: RadisState;
    patient: Patient | null;
    examinations: Examination[];
    indications: ClinicalIndication[];
    getFilteredVariants: () => ClinicalVariant[];
    setStep: (step: number) => void;
    setSelectedExam: (exam: Examination | null) => void;
    setSelectedIndication: (indication: ClinicalIndication | null) => void;
    setSelectedVariant: (variant: ClinicalVariant | null) => void;
    setScoringResults: (results: ScoringResult[]) => void;
    toggleSelectedResult: (procedure: string) => void;
    resetSelections: () => void;
    submitFeedback: (feedback: string) => void;
    addCustomIndication: (name: string) => void;
    addCustomVariant: (name: string) => void;
    authToken: string | null;
    switchToManualOverride: () => void;
}

const defaultState: RadisState = {
    step: 2,
    selectedExam: null,
    selectedIndication: null,
    selectedVariant: null,
    scoringResults: [],
    isManualSelection: false
};


const RadisContext = createContext<RadisContextType | undefined>(undefined);

export const RadisProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [state, setState] = useState<RadisState>(defaultState);
    const [patient, setPatient] = useState<Patient | null>(null);
    const [examinations] = useState<Examination[]>([]);
    const [indications, setIndications] = useState<ClinicalIndication[]>([]);
    const [variants, setVariants] = useState<ClinicalVariant[]>([]);
    const [authToken, setAuthToken] = useState<string | null>(null);


    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const parentOrigin = 'http://localhost:5174';
            if (event.origin !== parentOrigin) {
                console.warn(`Güvenilmeyen origin'den mesaj reddedildi: ${event.origin}`);
                return;
            }

            console.log("Child: Parent'tan mesaj alındı:", event.data);
            const data = event.data;

            if (data.authToken) {
                setAuthToken(data.authToken);
                sessionStorage.setItem('authToken', data.authToken);
            }

            const patientId = data.patientId || "ID bulunamadı";
            const name = data.name || "İsimsiz Hasta";
            const dob = data.dob;
            const lastVisit = data.lastVisit || "Bilinmiyor";
            const doctorName = data.doctorName || "Doktor Atanmamış";
            const hospitalName = data.hospitalName || "Hastane Bilgisi Yok";

            const calculateAge = (dobStr: string | null): string => {
                if (!dobStr) return "-";
                const birthDate = new Date(dobStr);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return age.toString();
            };

            const age = calculateAge(dob);
            const ageString = dob ? `${new Date(dob).toLocaleDateString('tr-TR')} (Yaş: ${age})` : "Bilinmiyor";

            const loadedPatient: Patient = {
                id: patientId, name, age: ageString,
                gender: "Belirtilmemiş", lastVisit, doctorName, hospitalName
            };
            setPatient(loadedPatient);

            if (data.selectedExam && data.selectedExam.id && data.selectedExam.name) {
                const loadedExam: Examination = {
                    id: data.selectedExam.id,
                    name: data.selectedExam.name,
                    code: data.selectedExam.code || undefined
                };
                setState(prev => ({...prev, selectedExam: loadedExam}));
            }
        };

        window.addEventListener("message", handleMessage);
        const parentOrigin = 'http://localhost:5174';
        console.log("Child: 'child-ready' message send.");
        window.parent.postMessage('child-ready', parentOrigin);

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);
    const setStep = useCallback((step: number) => {
        setState(prev => ({...prev, step}));
    }, []);

    const setSelectedExam = useCallback((selectedExam: Examination | null) => {
        setState(prev => ({...prev, selectedExam}));
    }, []);

    const setSelectedIndication = useCallback((selectedIndication: ClinicalIndication | null) => {
        setState(prev => ({
            ...prev,
            isManualSelection: false,
            selectedIndication,
            selectedVariant: null,
            scoringResults: []
        }));
    }, []);

    const setSelectedVariant = useCallback((selectedVariant: ClinicalVariant | null) => {
        setState(prev => ({
            ...prev,
            isManualSelection: false,
            selectedVariant,
            scoringResults: []
        }));
    }, []);

    const setScoringResults = useCallback((results: ScoringResult[]) => {
        setState(prev => ({...prev, scoringResults: results}));
    }, []);

    const toggleSelectedResult = useCallback((id: string) => {
        setState(prev => ({
            ...prev,
            scoringResults: prev.scoringResults.map(result => ({
                ...result,
                isSelected: result.id === id
            }))
        }));
    }, []);

    const getFilteredVariants = useCallback(() => {
        if (!state.selectedIndication) return [];
        return variants.filter(v => v.indicationId === state.selectedIndication?.id);
    }, [state.selectedIndication, variants]);

    const addCustomIndication = useCallback((name: string) => {
        const newIndication: ClinicalIndication = {id: `custom-${Date.now()}`, name, isCustom: true};
        setIndications(prev => [newIndication, ...prev]);
        setSelectedIndication(newIndication);
    }, [setSelectedIndication]);

    const addCustomVariant = useCallback((name: string) => {
        if (!state.selectedIndication) return;
        const newVariant: ClinicalVariant = {
            id: `custom-${Date.now()}`,
            name,
            indicationId: state.selectedIndication.id,
            isCustom: true
        };
        setVariants(prev => [newVariant, ...prev]);
        setSelectedVariant(newVariant);
        setStep(3);
    }, [state.selectedIndication, setSelectedVariant, setStep]);

    const resetSelections = useCallback(() => {
        setState(defaultState);
    }, []);


    const submitFeedback = useCallback((feedback: string) => {
        console.log("User Feedback Received:", {
            feedback: feedback,
            selection: {
                exam: state.selectedExam,
                indication: state.selectedIndication,
                variant: state.selectedVariant,
                finalResult: state.scoringResults.find(r => r.isSelected)
            }
        });
    }, [state]);


    const switchToManualOverride = useCallback(() => {
        setState(prev => ({
            ...prev,
            isManualSelection: true,
            step: 3
        }));
    }, []);

    return (
        <RadisContext.Provider
            value={{
                state,
                patient,
                examinations,
                indications,
                setStep,
                setSelectedExam,
                setSelectedIndication,
                setSelectedVariant,
                toggleSelectedResult,
                setScoringResults,
                getFilteredVariants,
                resetSelections,
                submitFeedback,
                addCustomIndication,
                addCustomVariant,
                authToken,
                switchToManualOverride

            }}
        >
            {children}
        </RadisContext.Provider>
    );
};

export const useRadis = (): RadisContextType => {
    const context = useContext(RadisContext);
    if (context === undefined) {
        throw new Error('useRadis must be used within a RadisProvider');
    }
    return context;
};