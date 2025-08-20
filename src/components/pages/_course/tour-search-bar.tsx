'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface MapSearchBarProps {
  onSearch?: (query: string) => void;
}

export default function MapSearchBar({ onSearch }: MapSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="absolute top-15 left-0 right-0 z-10 px-4">
      <form 
        onSubmit={handleSubmit}
        className="bg-white rounded-lg flex items-center overflow-hidden border border-gray-200"
      >        
        <input
          type="text"
          placeholder="관광지, 먹거리, 숙박 검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow py-3 px-2 outline-none text-sm"
        />
        
        <button 
          type="submit" 
          className="p-3 flex-shrink-0"
          aria-label="검색"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-6 h-6 text-gray-600"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" 
            />
          </svg>
        </button>
      </form>
    </div>
  );
} 