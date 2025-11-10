import React, { useState } from 'react';

const SearchForm: React.FC<{ onSearch: (registration: string) => void }> = ({ onSearch }) => {
    const [registration, setRegistration] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (registration.trim()) {
            onSearch(registration.trim());
            setRegistration('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <label htmlFor="registration" className="mb-2 text-lg font-semibold">
                Enter Vehicle Registration Number:
            </label>
            <input
                type="text"
                id="registration"
                value={registration}
                onChange={(e) => setRegistration(e.target.value)}
                className="border border-gray-300 rounded p-2 mb-4"
                placeholder="e.g. ABC1234"
                required
            />
            <button type="submit" className="bg-blue-500 text-white rounded p-2">
                Check MOT Status
            </button>
        </form>
    );
};

export default SearchForm;