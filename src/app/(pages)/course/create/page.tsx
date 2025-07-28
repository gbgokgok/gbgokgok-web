"use client"

import React from "react"
import Link from "next/link"

export default function CourseCreatePage() {
  return (
    <div className="p-4 pb-20">
      <div className="flex items-center mb-4">
        <Link href="/course" className="mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold">코스 만들기</h1>
      </div>
      {/* 코스 생성 폼 UI */}
    </div>
  )
} 