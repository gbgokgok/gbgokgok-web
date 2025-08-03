"use client"

import React from "react"
import { TabBar } from "@/components/ui/tab-bar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import MiniMap from "@/components/ui/mini-map"

export default function CoursePage() {
  return (
    <div className="pb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">관광지도</h1>
        <div className="bg-gray-100 rounded-lg overflow-hidden w-full aspect-square max-h-[300px]">
          <MiniMap height="100%" />
        </div>
        
        <div className="mt-4">
          <Link href="/course/create">
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium">
              코스 만들기
            </Button>
          </Link>
        </div>
      </div>
      <TabBar />
    </div>
  )
} 