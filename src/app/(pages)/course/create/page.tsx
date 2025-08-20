"use client"

import React from "react"
import Link from "next/link"

export default function CourseCreatePage() {
  return (
    <div className="p-4 pb-20">
      <div className="flex items-center mb-4">
        <Link href="/course" className="mr-2">
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
              d="M15.75 19.5L8.25 12l7.5-7.5" 
            />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold">코스 만들기</h1>
      </div>
      {/* 코스 생성 폼 UI */}
    </div>
  )
} 