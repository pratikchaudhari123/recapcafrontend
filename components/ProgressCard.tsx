'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award
} from 'lucide-react'

interface StudyStats {
  totalHours: number
  todayHours: number
  weeklyHours: number
  streak: number
}

export default function ProgressCard() {
  const [stats, setStats] = useState<StudyStats>({
    totalHours: 45,
    todayHours: 2.5,
    weeklyHours: 18,
    streak: 7
  })

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Your Progress</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Study Hours */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalHours}h
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Study Hours</p>
        </div>

        {/* Today's Hours */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
            <span className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.todayHours}h
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Today's Study Time</p>
        </div>

        {/* Weekly Hours */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {stats.weeklyHours}h
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
        </div>

        {/* Study Streak */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.streak}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
        </div>
      </div>

      {/* Progress Message */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Great work!</span> You're on a {stats.streak}-day study streak. 
          Keep it up to reach your CA goals!
        </p>
      </div>
    </div>
  )
}
