"use client"

import { TabBar } from "@/components/ui/tab-bar";

export default function Search() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">검색 페이지</h1>
          <p className="text-gray-500 mt-2">여기에 검색 기능이 구현될 예정입니다.</p>
        </div>
      </div>
      
      <TabBar />
    </div>
  )
} 