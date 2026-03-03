'use client'

import { useState, ReactNode } from 'react'
import { 
  MessageCircle, 
  Clock, 
  Calculator, 
  TrendingUp, 
  Settings, 
  Menu,
  X,
  LogOut,
  Crown,
  Home,
  BookOpen
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle'
import FloatingWidgets from '@/components/FloatingWidgets'
import { useAuth } from '@/context/AuthContext'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { currentUser, logout } = useAuth()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const sidebarItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'chat', label: 'AI Chat', icon: MessageCircle, href: '/chat' },
    { id: 'deep-study', label: 'Deep Study', icon: BookOpen, href: '/deep-study' },
    { id: 'timer', label: 'Study Timer', icon: Clock, href: '/timer' },
    { id: 'calculator', label: 'Calculator', icon: Calculator, href: '/calculator' },
    { id: 'progress', label: 'Progress', icon: TrendingUp, href: '/progress' },
    { id: 'subscription', label: 'Subscription', icon: Crown, href: '/subscription' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
  ]

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
            Recap CA AI
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
          
          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
          
          {/* Question History Section */}
          <div className="px-2">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
              Recent Questions
            </h3>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <div className="px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer truncate">
                No questions yet
              </div>
            </div>
          </div>
          
          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
          
          {/* Quick Stats Section */}
          <div className="px-2">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
              Quick Stats
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between px-2">
                <span className="text-gray-600 dark:text-gray-400">Study Time</span>
                <span className="font-medium text-gray-900 dark:text-white">2h 30m</span>
              </div>
              <div className="flex justify-between px-2">
                <span className="text-gray-600 dark:text-gray-400">Questions</span>
                <span className="font-medium text-gray-900 dark:text-white">12</span>
              </div>
              <div className="flex justify-between px-2">
                <span className="text-gray-600 dark:text-gray-400">Streak</span>
                <span className="font-medium text-gray-900 dark:text-white">7 days 🔥</span>
              </div>
            </div>
          </div>
        </nav>

        {/* User info section - Fixed at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">
                {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-gray-900 dark:text-white">
                {currentUser?.email || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                Free Plan
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content area - Flex */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Fixed */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold">
                {sidebarItems.find(item => item.href === pathname)?.label || 'Dashboard'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Page content - Takes remaining height, NO scrolling here */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>

      {/* Floating Widgets - Available everywhere */}
      <FloatingWidgets />
    </div>
  )
}
