'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Minus, Clock, Play, Pause, RotateCcw } from 'lucide-react'

interface FloatingTimerProps {
  onClose: () => void
}

export default function FloatingTimer({ onClose }: FloatingTimerProps) {
  const [time, setTime] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [mode, setMode] = useState<'pomodoro' | 'short' | 'long' | 'custom'>('pomodoro')
  
  // Dragging state
  const [position, setPosition] = useState({ x: 0, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const timerRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Set initial position after mount
  useEffect(() => {
    setPosition({ x: window.innerWidth - 350, y: 100 })
  }, [])

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  // Handle mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  // Timer logic
  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            playSound()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, time])

  const playSound = () => {
    // Play notification sound when timer ends
    const audio = new Audio('/notification.mp3')
    audio.play().catch(() => {
      // Fallback if audio doesn't play
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Timer Complete!', {
          body: 'Your study session has ended.',
          icon: '/icon.png'
        })
      }
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleModeChange = (newMode: 'pomodoro' | 'short' | 'long' | 'custom') => {
    setMode(newMode)
    setIsRunning(false)
    
    switch (newMode) {
      case 'pomodoro':
        setTime(25 * 60)
        break
      case 'short':
        setTime(5 * 60)
        break
      case 'long':
        setTime(15 * 60)
        break
      case 'custom':
        setTime(30 * 60)
        break
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    handleModeChange(mode)
  }

  const progress = mode === 'pomodoro' ? ((25 * 60 - time) / (25 * 60)) * 100 :
                   mode === 'short' ? ((5 * 60 - time) / (5 * 60)) * 100 :
                   mode === 'long' ? ((15 * 60 - time) / (15 * 60)) * 100 :
                   ((30 * 60 - time) / (30 * 60)) * 100

  if (isMinimized) {
    return (
      <div
        ref={timerRef}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 9999
        }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-green-500 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">{formatTime(time)}</span>
            {isRunning && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded text-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={timerRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999
      }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-green-500 w-80"
    >
      {/* Header - Draggable */}
      <div
        className="flex items-center justify-between p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-lg cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-white" />
          <span className="font-semibold text-white">Study Timer</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 hover:bg-white/20 rounded text-white"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Timer Display */}
      <div className="p-6">
        {/* Progress Circle */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg className="transform -rotate-90 w-48 h-48">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
              className="text-green-500 transition-all duration-1000"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                {formatTime(time)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {mode === 'pomodoro' ? 'Pomodoro' :
                 mode === 'short' ? 'Short Break' :
                 mode === 'long' ? 'Long Break' : 'Custom'}
              </div>
            </div>
          </div>
        </div>

        {/* Mode Buttons */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <button
            onClick={() => handleModeChange('pomodoro')}
            className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              mode === 'pomodoro'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            25m
          </button>
          <button
            onClick={() => handleModeChange('short')}
            className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              mode === 'short'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            5m
          </button>
          <button
            onClick={() => handleModeChange('long')}
            className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              mode === 'long'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            15m
          </button>
          <button
            onClick={() => handleModeChange('custom')}
            className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              mode === 'custom'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            30m
          </button>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors shadow-lg"
          >
            {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>
          <button
            onClick={handleReset}
            className="p-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full transition-colors"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        {/* Status */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isRunning ? '🔥 Focus time!' : time === 0 ? '✅ Session complete!' : '⏸️ Paused'}
          </p>
        </div>
      </div>
    </div>
  )
}
