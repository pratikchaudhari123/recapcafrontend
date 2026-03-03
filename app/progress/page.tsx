'use client';

import { useState, useEffect } from 'react';
import ProgressCard from '@/components/ProgressCard';
import { useStudyTracker } from '@/hooks/useStudyTracker';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Calendar, Clock, Target, TrendingUp, BookOpen, Award } from 'lucide-react';

export default function ProgressPage() {
  const { sessions, stats, isLoading } = useStudyTracker();
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const progressCards = [
    {
      title: 'Total Study Hours',
      value: stats.totalHours.toFixed(1),
      unit: 'hours',
      icon: Clock,
      color: 'blue',
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      title: 'Current Streak',
      value: stats.streak.toString(),
      unit: 'days',
      icon: Award,
      color: 'green',
      change: '+2 days',
      changeType: 'positive' as const
    },
    {
      title: 'Weekly Hours',
      value: stats.weeklyHours.toFixed(1),
      unit: 'hours',
      icon: TrendingUp,
      color: 'purple',
      change: '+8%',
      changeType: 'positive' as const
    },
    {
      title: 'Sessions Today',
      value: stats.sessionsToday.toString(),
      unit: 'sessions',
      icon: BookOpen,
      color: 'orange',
      change: '+1',
      changeType: 'positive' as const
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Study Progress
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your learning journey and celebrate your achievements
          </p>
        </div>

        {/* Period Selector */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg w-fit">
            {['week', 'month', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {progressCards.map((card, index) => (
            <ProgressCard key={index} {...card} />
          ))}
        </div>

        {/* Study Sessions Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Study Activity
            </h2>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Chart visualization coming soon</p>
              <p className="text-sm">Your study patterns will be displayed here</p>
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Recent Study Sessions
          </h2>
          
          <div className="space-y-4">
            {sessions.slice(-5).reverse().map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {session.subject}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(session.startTime).toLocaleDateString()} at{' '}
                    {new Date(session.startTime).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {Math.floor(session.duration / 60)} min
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Duration
                  </p>
                </div>
              </div>
            ))}
            
            {sessions.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No study sessions yet</p>
                <p className="text-sm">Start studying to see your sessions here</p>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}