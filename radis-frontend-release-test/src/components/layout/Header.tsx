import React from 'react';
import {Activity} from 'lucide-react';

interface HeaderProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = () => {
    return (
        <header
            className="bg-white dark:bg-gray-800 shadow-sm py-3 px-4 sm:px-6 flex justify-between items-center sticky top-0 z-10 ">
            <div className="flex items-center">
                <Activity size={28} className="text-cyan-600 mr-2"/>
                <h1 className="text-xl font-bold text-gray-900">RADIS</h1>
                <span className="ml-2 text-sm bg-cyan-100 text-cyan-800 font-medium px-2 py-0.5 rounded">
              Klinik Karar Destek Sistemi
            </span>

            </div>
            <div className="flex items-center">
                {/*<button*/}
                {/*    onClick={toggleDarkMode}*/}
                {/*    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"*/}
                {/*    aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}*/}
                {/*>*/}
                {/*    {darkMode ? <Sun className="h-5 w-5 text-yellow-400"/> : <Moon className="h-5 w-5 text-gray-600"/>}*/}
                {/*</button>*/}
            </div>
        </header>
    );
};

export default Header;