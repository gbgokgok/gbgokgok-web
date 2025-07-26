"use client"

import { TabBar } from "@/components/ui/tab-bar";

export default function My() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">마이 페이지</h1>
          <p className="text-gray-500 mt-2">여기에 사용자 정보가 표시될 예정입니다.</p>
        </div>
      </div>
      
      <TabBar />
    </div>
  )
} 