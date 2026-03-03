'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Crown } from 'lucide-react'

import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export default function AIChat() {
  const { currentUser } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI study mentor for CA. I can help you with accounting concepts, tax laws, audit procedures, and study strategies. What would you like to learn today?',
      role: 'assistant',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([
    'Explain AS 1',
    'Depreciation methods',
    'GST calculation',
    'Audit procedures',
    'Tax planning tips',
    'Study schedule'
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input on component mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Update suggestions based on last user message
  const updateSuggestions = (lastUserMessage: string) => {
    const lowerMessage = lastUserMessage.toLowerCase()
    
    // Generate contextual suggestions based on keywords
    if (lowerMessage.includes('law') || lowerMessage.includes('legal')) {
      setSuggestions([
        'Company Law basics',
        'Contract Act provisions',
        'Partnership Act details',
        'LLP Act overview',
        'Competition Act',
        'More law topics'
      ])
    } else if (lowerMessage.includes('tax') || lowerMessage.includes('gst') || lowerMessage.includes('income')) {
      setSuggestions([
        'GST rates and slabs',
        'Income Tax deductions',
        'TDS provisions',
        'Tax planning strategies',
        'ITR filing process',
        'Tax exemptions'
      ])
    } else if (lowerMessage.includes('audit') || lowerMessage.includes('auditor')) {
      setSuggestions([
        'Audit procedures',
        'Internal audit vs external',
        'Audit report format',
        'SA standards',
        'Audit evidence',
        'Risk assessment'
      ])
    } else if (lowerMessage.includes('account') || lowerMessage.includes('as ') || lowerMessage.includes('depreciation')) {
      setSuggestions([
        'AS standards overview',
        'Ind AS differences',
        'Inventory valuation',
        'Revenue recognition',
        'Cash flow statement',
        'Financial ratios'
      ])
    } else if (lowerMessage.includes('cost') || lowerMessage.includes('costing')) {
      setSuggestions([
        'Cost accounting methods',
        'Standard costing',
        'Marginal costing',
        'Budget preparation',
        'Variance analysis',
        'Break-even analysis'
      ])
    } else if (lowerMessage.includes('fm') || lowerMessage.includes('financial management') || lowerMessage.includes('finance')) {
      setSuggestions([
        'Time value of money',
        'Capital budgeting',
        'Working capital',
        'Cost of capital',
        'Dividend policy',
        'Financial leverage'
      ])
    } else {
      // Default suggestions
      setSuggestions([
        'Explain AS 1',
        'Company Law topics',
        'GST calculation',
        'Audit procedures',
        'Tax planning tips',
        'Study schedule'
      ])
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setSubscriptionError(null)

    // Update suggestions based on user's question
    updateSuggestions(userMessage.content)

    try {
      // Get auth token if user is logged in
      let token = null
      if (currentUser) {
        token = await currentUser.getIdToken()
      }

      // Call the backend API via proxy route
      const response = await fetch('/api/proxy/api/ask-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ question: userMessage.content })
      })

      if (!response.ok) {
        const errorData = await response.json()
        
        // Handle subscription limit errors
        if (response.status === 403 && errorData.detail?.error === 'subscription_limit_reached') {
          setSubscriptionError(errorData.detail.message)
          setShowUpgradeModal(true)
          
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: errorData.detail.message,
            role: 'assistant',
            timestamp: new Date()
          }
          setMessages(prev => [...prev, errorMessage])
          return
        }
        
        throw new Error(errorData.detail || 'Failed to get response')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.answer,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to get AI response. Please try again.')
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Upgrade Required
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {subscriptionError || 'You\'ve reached your question limit. Upgrade to continue learning!'}
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowUpgradeModal(false)
                    router.push('/subscription')
                  }}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  View Plans & Upgrade
                </button>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages container - Full height with centered content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-primary-500 to-blue-500">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div className={`flex-1 ${message.role === 'user' ? 'max-w-2xl' : 'max-w-full'}`}>
                <div className={`px-5 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-primary-600 text-white ml-auto inline-block'
                    : 'bg-transparent text-gray-900 dark:text-white'
                }`}>
                  <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{message.content}</p>
                </div>
              </div>
              
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-700 dark:bg-gray-600">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-blue-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center space-x-2 px-4 py-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary-600 dark:text-primary-400" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">Thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Input area at bottom - ChatGPT style */}
      <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent dark:from-gray-800 dark:via-gray-800 dark:to-transparent pt-6 pb-4">
        <div className="max-w-4xl mx-auto px-4">
          {/* Quick suggestions - only show when no messages */}
          {messages.length <= 1 && (
            <div className="mb-4 flex flex-wrap gap-2 justify-center">
              {suggestions.slice(0, 4).map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInputMessage(suggestion)}
                  className="px-4 py-2 text-sm bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full transition-all duration-200 border border-gray-200 dark:border-gray-600 shadow-sm"
                  disabled={isLoading}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          
          {/* Input box - ChatGPT style */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Recap CA AI..."
              className="w-full pl-5 pr-12 py-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-[15px] shadow-lg transition-all"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-full transition-all duration-200 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          
          {/* Footer text */}
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">
            Recap CA AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  )
}