"use client"

import React from "react"
import { TabBar } from "@/components/ui/tab-bar"

export default function CoursePage() {
  return (
    <div className="pb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">지도</h1>
        <div className="bg-gray-100 rounded-lg p-4 aspect-square w-full max-h-[300px] flex items-center justify-center">
          <p className="text-gray-500">지도 콘텐츠가 여기에 표시됩니다</p>
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">추천 코스</h2>
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <h3 className="font-medium">추천 코스 {item}</h3>
                <p className="text-sm text-gray-500 mt-1">코스 설명이 여기에 표시됩니다</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">인기 코스</h2>
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <h3 className="font-medium">인기 코스 {item}</h3>
                <p className="text-sm text-gray-500 mt-1">코스 설명이 여기에 표시됩니다</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <TabBar />
    </div>
  )
} 