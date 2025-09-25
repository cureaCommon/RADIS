import React, {useState, useEffect} from 'react';
import Header from './components/layout/Header';
import PatientInfo from './components/layout/PatientInfo';
import ProgressBar from './components/layout/ProgressBar';
import ClinicalIndication from './components/steps/ClinicalIndication';
import Suitability from './components/steps/Suitability';
import {RadisProvider, useRadis} from './context/RadisContext';
import LoadingSpinner from "./components/ui/LoadingSpinner.tsx";

const RadisApp: React.FC = () => {
    const {state, patient} = useRadis();
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
    });


    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);


    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    if (!patient) {
        return (
            <div className="flex items-center justify-center min-h-screen text-center p-4">
                <LoadingSpinner text="Hasta bilgileri bekleniyor..."/>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
            <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode}/>
            <PatientInfo patient={patient}/>
            <ProgressBar/>

            <main>
                {state.step === 2 && <ClinicalIndication/>}
                {state.step === 3 && <Suitability/>}
            </main>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <RadisProvider>
            <RadisApp/>
        </RadisProvider>
    );
};

export default App;