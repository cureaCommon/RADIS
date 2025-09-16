import React, {useState, useRef, useEffect} from 'react';

interface SearchInputProps {
    placeholder: string;
    onSearch: (query: string) => void;
    value?: string;
    autoFocus?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
                                                     placeholder,
                                                     value,
                                                     onSearch,
                                                     autoFocus,
                                                 }) => {
    const [internalQuery, setInternalQuery] = useState(value || '');
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


    return (
        <div className="relative">
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
        </div>
    );
};

export default SearchInput;