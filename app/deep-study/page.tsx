'use client'

import { useState } from 'react'
import { BookOpen, Brain, Target, Clock, CheckCircle, TrendingUp, Lightbulb, FileText } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'

export default function DeepStudyPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  const studyTopics = [
    {
      id: 'accounting',
      title: 'Accounting Standards',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      description: 'Master AS and Ind AS with deep conceptual understanding',
      modules: ['AS 1-29', 'Ind AS Overview', 'Convergence', 'Practical Applications']
    },
    {
      id: 'taxation',
      title: 'Taxation',
      icon: Target,
      color: 'from-green-500 to-green-600',
      description: 'Income Tax, GST, and International Taxation',
      modules: ['Income Tax Act', 'GST Laws', 'TDS/TCS', 'Tax Planning']
    },
    {
      id: 'audit',
      title: 'Auditing',
      icon: CheckCircle,
      color: 'from-purple-500 to-purple-600',
      description: 'Audit procedures, standards, and practical approach',
      modules: ['SA Standards', 'Audit Planning', 'Internal Controls', 'Reporting']
    },
    {
      id: 'law',
      title: 'Corporate Laws',
      icon: Brain,
      color: 'from-red-500 to-red-600',
      description: 'Company Law, SEBI, and other corporate regulations',
      modules: ['Companies Act', 'SEBI Regulations', 'FEMA', 'IBC']
    },
    {
      id: 'costing',
      title: 'Cost & Management',
      icon: TrendingUp,
      color: 'from-yellow-500 to-yellow-600',
      description: 'Cost accounting and management decision making',
      modules: ['Costing Methods', 'Budgeting', 'Variance Analysis', 'Decision Making']
    },
    {
      id: 'fm',
      title: 'Financial Management',
      icon: Lightbulb,
      color: 'from-indigo-500 to-indigo-600',
      description: 'Financial planning, analysis, and strategic decisions',
      modules: ['Capital Budgeting', 'Working Capital', 'Valuation', 'Risk Management']
    }
  ]

  const studyMethods = [
    {
      title: 'Conceptual Learning',
      description: 'Build strong foundation with theory and concepts',
      icon: Brain,
      color: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
    },
    {
      title: 'Practice Problems',
      description: 'Solve numerical and practical questions',
      icon: Target,
      color: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300'
    },
    {
      title: 'Case Studies',
      description: 'Apply knowledge to real-world scenarios',
      icon: FileText,
      color: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300'
    },
    {
      title: 'Revision & Tests',
      description: 'Regular revision and mock tests',
      icon: CheckCircle,
      color: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300'
    }
  ]

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Deep Study Mode</h1>
                  <p className="text-gray-600 dark:text-gray-400">Intensive learning for CA preparation</p>
                </div>
              </div>
            </div>

            {/* Study Methods */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Study Approach</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {studyMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <div
                      key={method.title}
                      className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
                    >
                      <div className={`w-12 h-12 ${method.color} rounded-lg flex items-center justify-center mb-3`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{method.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{method.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Study Topics */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Choose Your Topic</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studyTopics.map((topic) => {
                  const Icon = topic.icon
                  return (
                    <div
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic.id)}
                      className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 cursor-pointer transition-all hover:shadow-xl ${
                        selectedTopic === topic.id
                          ? 'border-primary-500 shadow-lg'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className={`w-14 h-14 bg-gradient-to-br ${topic.color} rounded-xl flex items-center justify-center mb-4`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{topic.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{topic.description}</p>
                      
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Modules:</p>
                        <div className="flex flex-wrap gap-2">
                          {topic.modules.map((module) => (
                            <span
                              key={module}
                              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium"
                            >
                              {module}
                            </span>
                          ))}
                        </div>
                      </div>

                      {selectedTopic === topic.id && (
                        <button className="mt-4 w-full bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all">
                          Start Deep Study
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Study Stats */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Study Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">0</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Topics Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">0h</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Study Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">0</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Practice Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">0%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</div>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="mt-8 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 border border-primary-200 dark:border-gray-600">
              <div className="flex items-start space-x-3">
                <Lightbulb className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Deep Study Tips</h3>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>• Focus on one topic at a time for better retention</li>
                    <li>• Take notes and create mind maps for complex concepts</li>
                    <li>• Practice numerical problems immediately after theory</li>
                    <li>• Review previous topics regularly to maintain memory</li>
                    <li>• Use the AI Chat for clarifying doubts instantly</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
