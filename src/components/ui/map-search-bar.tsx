'use client';

import { useState } from 'react';

interface MapSearchBarProps {
  onSearch?: (query: string) => void;
  onMenuClick?: () => void;
}

export default function MapSearchBar({ onSearch, onMenuClick }: MapSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="absolute top-4 left-0 right-0 z-10 px-4">
      <form 
        onSubmit={handleSubmit}
        className="bg-white rounded-full shadow-md flex items-center overflow-hidden"
      >
        <button 
          type="button" 
          onClick={onMenuClick}
          className="p-3 flex-shrink-0"
          aria-label="메뉴"
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
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" 
            />
          </svg>
        </button>
        
        <input
          type="text"
          placeholder="장소, 버스, 지하철, 주소 검색"
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