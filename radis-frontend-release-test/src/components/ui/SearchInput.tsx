import React, {useState, useRef, useEffect} from 'react';
import {Search} from 'lucide-react';

interface SearchInputProps {
    placeholder: string;
    onSearch: (query: string) => void;
    //onAddCustom?: (value: string) => void;
    //showAddButton?: boolean;
    value?: string;
    autoFocus?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
                                                     placeholder,
                                                     value,
                                                     onSearch,
                                                     autoFocus,
                                                     //onAddCustom,
                                                     //showAddButton = false
                                                 }) => {
    const [internalQuery, setInternalQuery] = useState(value || '');
    //const [showAddOption, setShowAddOption] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (value !== undefined) {
            setInternalQuery(value);
        }
    }, [value]);

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(internalQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [internalQuery, onSearch]);

    // useEffect(() => {
    //     setShowAddOption(showAddButton && internalQuery.length > 0);
    // }, [internalQuery, showAddButton]);
    //
    // const handleAddCustom = () => {
    //     if (onAddCustom && internalQuery.trim()) {
    //         onAddCustom(internalQuery.trim());
    //         setInternalQuery('');
    //     }
    // };

    return (
        <div className="relative">
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400"/>
                </span>
                <input
                    ref={inputRef}
                    type="text"
                    className="w-full py-2 pl-10 pr-12 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                    placeholder={placeholder}
                    value={internalQuery}
                    onChange={(e) => setInternalQuery(e.target.value)}
                    autoFocus={autoFocus}
                />
            </div>

            {/*{showAddOption && (*/}
            {/*    <div*/}
            {/*        className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">*/}
            {/*        <button*/}
            {/*            className="w-full px-4 py-2 flex items-center text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"*/}
            {/*            onClick={handleAddCustom}*/}
            {/*        >*/}
            {/*            <Plus className="w-4 h-4 mr-2 text-green-500"/>*/}
            {/*            <span>Ekle "{internalQuery}"</span>*/}
            {/*        </button>*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    );
};

export default SearchInput;