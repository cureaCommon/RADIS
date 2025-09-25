import React from 'react';
import type {Patient} from '../../types';
import {UserRound, Calendar, ClipboardList} from 'lucide-react';

interface PatientInfoProps {
    patient: Patient;
}

const PatientInfo: React.FC<PatientInfoProps> = ({patient}) => {

    return (
        <div
            className="bg-white rounded-lg shadow-sm p-4 max-w-4xl mx-auto my-4 ">
            <div className="flex items-center space-x-4 mb-4">
                <div className="bg-cyan-600 p-3 rounded-full">
                    <UserRound size={24} className="text-white"/>
                </div>
                <div>
                    <h2 className="text-xl font-semibold">{patient.name}</h2>
                    <div className="flex items-center text-gray-600 space-x-4 mt-1">
            <span className="flex items-center">
              <Calendar size={16} className="mr-1"/>
                {patient.age}
            </span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-sm">{patient.gender}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-500">Hasta Numarası</p>
                    <p className="font-medium">{patient.id}</p>
                </div>
                {patient.lastVisit && (
                    <div className="bg-gray-50 p-3 rounded flex items-start">
                        <ClipboardList size={16} className="text-gray-500 mr-2 mt-0.5"/>
                        <div>
                            <p className="text-sm text-gray-500">Son ziyaret</p>
                            <p className="font-medium">{new Date(patient.lastVisit).toLocaleDateString()}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientInfo;