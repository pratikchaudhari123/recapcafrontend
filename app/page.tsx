'use client'

import { useState } from 'react'
import { 
  MessageCircle, 
  Clock, 
  Calculator, 
  TrendingUp, 
  Settings, 
  Menu,
  X,
  LogOut,
  Crown
} from 'lucide-react'
import AIChat from '@/components/AIChat'
import StudyTimer from '@/components/StudyTimer'
import StudyCalculator from '@/components/StudyCalculator'
import ProgressCard from '@/components/ProgressCard'
import ThemeToggle from '@/components/ThemeToggle'
import QuestionHistory from '@/components/QuestionHistory'
import ProtectedRoute from '@/components/ProtectedRoute'
import SubscriptionStatus from '@/components/SubscriptionStatus'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('chat')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { currentUser, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const sidebarItems = [
    { id: 'chat', label: 'AI Chat', icon: MessageCircle },
    { id: 'timer', label: 'Study Timer', icon: Clock },
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'subscription', label: 'Subscription', icon: Crown },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <AIChat />
      case 'timer':
        return <StudyTimer />
      case 'calculator':
        return <StudyCalculator />
      case 'progress':
        return <ProgressCard />
      case 'subscription':
        return (
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Subscription</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Redirecting to subscription page...
            </p>
          </div>
        )
      case 'settings':
        return (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Theme</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Choose your preferred theme
                  </p>
                </div>
                <ThemeToggle />
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="font-medium mb-4">Study Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Default Study Duration (minutes)
                    </label>
                    <input 
                      type="number" 
                      className="input-field w-32" 
                      defaultValue={25}
                      min={1}
                      max={120}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Break Duration (minutes)
                    </label>
                    <input 
                      type="number" 
                      className="input-field w-32" 
                      defaultValue={5}
                      min={1}
                      max={30}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return <AIChat />
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
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
        
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'subscription') {
                    router.push('/subscription')
                  } else {
                    setActiveTab(item.id)
                  }
                  setSidebarOpen(false)
                }}
                className={`sidebar-item w-full ${
                  activeTab === item.id ? 'active' : ''
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* User info section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {currentUser?.email || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                Free Plan
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
        </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold capitalize">
                {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'chat' && (
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-full">
                <div className="xl:col-span-3">
                  {renderContent()}
                </div>
                <div className="space-y-6">
                  <SubscriptionStatus />
                  <QuestionHistory />
                  <div className="card">
                    <h3 className="font-semibold mb-4">Quick Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Today's Study Time
                        </span>
                        <span className="font-medium">2h 30m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Questions Asked
                        </span>
                        <span className="font-medium">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Study Streak
                        </span>
                        <span className="font-medium">7 days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab !== 'chat' && renderContent()}
          </div>
        </main>
      </div>
      </div>
    </ProtectedRoute>
  )
}