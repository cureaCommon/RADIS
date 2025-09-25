import {useEffect, useRef, useState} from 'react';
import {HashRouter, Routes, Route, useParams, Navigate, useLocation} from 'react-router-dom';
import LoadingSpinner from "./LoadingSpinner.tsx";
import {login} from "./api/authService.ts";
import ExamSelection from './components/steps/ExamSelection';
import type { Examination } from './types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient();

const PatientPage = () => {
    const { patientId } = useParams();
    const location = useLocation();
    const patientDataFromState = location.state;
    const [selectedExam, setSelectedExam] = useState<Examination | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);


    const handleExamSelection = (exam: Examination) => {
        setSelectedExam(exam);
    };

    const authToken = sessionStorage.getItem('authToken');
    const iframeUrl = `http://188.166.82.72:3001/`;
    const childOrigin = 'http://188.166.82.72:3001';

    const sendMessageToIframe = () => {
        if (!iframeRef.current?.contentWindow) {
            console.error("Iframe content window bulunamadı.");
            return;
        }

        const dataToSend = {
            patientId,
            name: patientDataFromState?.name,
            dob: patientDataFromState?.dob,
            lastVisit: patientDataFromState?.lastVisit,
            doctorName: patientDataFromState?.doctorName,
            hospitalName: patientDataFromState?.hospitalName,
            authToken,
            selectedExam
        };
        iframeRef.current.contentWindow.postMessage(dataToSend, childOrigin);
    };

    useEffect(() => {
        if (selectedExam) {
            const handleChildMessage = (event: MessageEvent) => {
                if (event.origin !== childOrigin) return;

                if (event.data === 'child-ready') {
                    console.log("Parent: 'child-ready' message received from child.");
                    sendMessageToIframe();
                }
            };

            window.addEventListener('message', handleChildMessage);

            return () => {
                window.removeEventListener('message', handleChildMessage);
            };
        }
    }, [selectedExam]);

    if (!patientDataFromState) {
        return <div className="p-8 text-center">Hasta verisi bulunamadı</div>
    }

    return (
        <div className="p-8 ...">
            {!selectedExam ? (
                <ExamSelection onExamSelect={handleExamSelection} />
            ) : (
                <div className="mt-8 w-[90vw] h-[90vh] mx-auto">
                    <iframe
                        ref={iframeRef}
                        onLoad={sendMessageToIframe}
                        src={iframeUrl}
                        className="w-full h-full border-0"
                        title="Radis Projesi"
                    />
                </div>
            )}
        </div>
    );
};

const App = () => {
    const [isAppLoading, setIsAppLoading] = useState(true);
    const [loginError, setLoginError] = useState<string | null>(null);

    const defaultPatientData = {
        patientId: 'H1234',
        name: 'Ahmet Yılmaz',
        dob: '1980-05-14',
        lastVisit: '2025-06-10',
        doctorName: 'Dr. Ayşe Öztürk',
        hospitalName: 'Merkez Hastanesi'
    };



    const redirectTo = `/patient/${defaultPatientData.patientId}`;


    useEffect(() => {
        const autoLogin = async () => {
            if (sessionStorage.getItem('authToken')) {
                setIsAppLoading(false);
                return;
            }
            try {
                const username = import.meta.env.VITE_APP_USERNAME;
                const password = import.meta.env.VITE_APP_PASSWORD;
                if (!username || !password) {
                    const errorMsg = "Ortam değişkenleri eksik.";
                    setLoginError(errorMsg);
                    throw new Error(errorMsg);
                }
                await login({username, password});
            } catch (error: any) {
                console.error("Otomatik giriş başarısız:", error);
                setLoginError(error.message || "Giriş sırasında bilinmeyen bir hata oluştu.");
            } finally {
                setIsAppLoading(false);
            }
        };
        autoLogin();
    }, []);

    if (isAppLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner/>
            </div>
        );
    }

    if (loginError) {
        return (
            <div className="p-8 text-center text-red-500">
                <h2 className="text-xl font-bold mb-2">Giriş Başarısız</h2>
                <p>{loginError}</p>
            </div>
        );
    }

    return (
        <QueryClientProvider client={queryClient}>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Navigate to={redirectTo} replace state={defaultPatientData} />} />
                    <Route path="/patient/:patientId" element={<PatientPage />} />
                    <Route path="*" element={<div className="p-8 text-center text-red-500">404 - Sayfa Bulunamadı</div>} />
                </Routes>
            </HashRouter>
        </QueryClientProvider>
    );
};

export default App;