"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HomeIcon, Search, User, Map } from "lucide-react"

interface TabItem {
  icon: React.ReactNode
  label: string
  href: string
}

const tabs: TabItem[] = [
  {
    icon: <HomeIcon className="w-6 h-6" />,
    label: "홈",
    href: "/"
  },
  {
    icon: <Map className="w-6 h-6" />,
    label: "코스",
    href: "/course"
  },
  {
    icon: <Search className="w-6 h-6" />,
    label: "검색",
    href: "/search"
  },
  {
    icon: <User className="w-6 h-6" />,
    label: "마이",
    href: "/my"
  }
]

export function TabBar() {
  const pathname = usePathname()
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          
          return (
            <Link 
              key={tab.href} 
              href={tab.href}
              className="flex flex-col items-center py-2"
            >
              <div className={isActive ? "text-blue-600" : "text-gray-400"}>
                {tab.icon}
              </div>
              <span className={`text-xs mt-1 ${isActive ? "text-blue-600" : "text-gray-400"}`}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
} 