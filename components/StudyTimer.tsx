'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, Square, RotateCcw, Clock } from 'lucide-react'
import { useTimer } from '@/hooks/useTimer'
import { apiService } from '@/services/api'
import toast from 'react-hot-toast'

export default function StudyTimer() {
  const [studyDuration, setStudyDuration] = useState(25) // minutes
  const [breakDuration, setBreakDuration] = useState(5) // minutes
  const [isBreakTime, setIsBreakTime] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [totalStudyTime, setTotalStudyTime] = useState(0) // in seconds

  const {
    time,
    isRunning,
    start,
    pause,
    reset,
    setTime
  } = useTimer({ initialTime: studyDuration * 60 })

  // Update timer when duration changes
  useEffect(() => {
    const duration = isBreakTime ? breakDuration : studyDuration
    setTime(duration * 60)
  }, [studyDuration, breakDuration, isBreakTime, setTime])

  // Handle timer completion
  useEffect(() => {
    if (time === 0 && isRunning) {
      handleTimerComplete()
    }
  }, [time, isRunning])

  const handleTimerComplete = async () => {
    if (isBreakTime) {
      // Break completed, start study session
      setIsBreakTime(false)
      toast.success('Break time over! Ready to study?')
      pause()
    } else {
      // Study session completed
      setSessions(prev => prev + 1)
      setTotalStudyTime(prev => prev + (studyDuration * 60))
      
      // Save study session to backend
      try {
        await apiService.saveStudySession({
          subject: 'Study Session',
          duration: studyDuration * 60,
          startTime: new Date(Date.now() - studyDuration * 60 * 1000).toISOString(),
          endTime: new Date().toISOString()
        })
        toast.success(`Study session completed! ${studyDuration} minutes logged.`)
      } catch (error) {
        console.error('Error saving study session:', error)
        toast.error('Session completed but failed to save. Please check your connection.')
      }

      // Start break time
      setIsBreakTime(true)
      toast.success(`Great work! Take a ${breakDuration} minute break.`)
    }
  }

  const handleStart = () => {
    start()
    toast.success(isBreakTime ? 'Break timer started!' : 'Study session started!')
  }

  const handlePause = () => {
    pause()
    toast('Timer paused')
  }

  const handleReset = () => {
    reset()
    setIsBreakTime(false)
    toast('Timer reset')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${mins}m`
  }

  const getProgress = () => {
    const totalDuration = (isBreakTime ? breakDuration : studyDuration) * 60
    return ((totalDuration - time) / totalDuration) * 100
  }

  return (
    <div className="space-y-6">
      {/* Main Timer Card */}
      <div className="card text-center">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {isBreakTime ? 'Break Time' : 'Study Session'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {isBreakTime 
              ? 'Take a well-deserved break!' 
              : 'Focus on your CA studies'
            }
          </p>
        </div>

        {/* Timer Display */}
        <div className="relative mb-8">
          <div className="w-48 h-48 mx-auto relative">
            {/* Progress Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
                className={`transition-all duration-1000 ${
                  isBreakTime 
                    ? 'text-green-500' 
                    : 'text-primary-500'
                }`}
                strokeLinecap="round"
              />
            </svg>
            
            {/* Time Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div>
                <div className="text-4xl font-bold mb-2">
                  {formatTime(time)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {isBreakTime ? 'Break' : 'Study'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex justify-center space-x-4 mb-6">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="btn-primary flex items-center space-x-2 px-6 py-3"
            >
              <Play className="w-5 h-5" />
              <span>Start</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="btn-secondary flex items-center space-x-2 px-6 py-3"
            >
              <Pause className="w-5 h-5" />
              <span>Pause</span>
            </button>
          )}
          
          <button
            onClick={handleReset}
            className="btn-secondary flex items-center space-x-2 px-6 py-3"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Session Stats */}
        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div>
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {sessions}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Sessions Today
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {formatTotalTime(totalStudyTime)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Study Time
            </div>
          </div>
        </div>
      </div>

      {/* Timer Settings */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Timer Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Study Duration (minutes)
            </label>
            <input
              type="number"
              value={studyDuration}
              onChange={(e) => setStudyDuration(Number(e.target.value))}
              min={1}
              max={120}
              className="input-field"
              disabled={isRunning}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Break Duration (minutes)
            </label>
            <input
              type="number"
              value={breakDuration}
              onChange={(e) => setBreakDuration(Number(e.target.value))}
              min={1}
              max={30}
              className="input-field"
              disabled={isRunning}
            />
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="mt-6">
          <p className="text-sm font-medium mb-3">Quick Presets:</p>
          <div className="flex flex-wrap gap-2">
            {[
              { study: 25, break: 5, name: 'Pomodoro' },
              { study: 45, break: 15, name: 'Extended' },
              { study: 90, break: 20, name: 'Deep Work' },
            ].map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  setStudyDuration(preset.study)
                  setBreakDuration(preset.break)
                }}
                disabled={isRunning}
                className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                {preset.name} ({preset.study}m/{preset.break}m)
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}