'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Minus, Calculator as CalcIcon } from 'lucide-react'

interface FloatingCalculatorProps {
  onClose: () => void
}

export default function FloatingCalculator({ onClose }: FloatingCalculatorProps) {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [isMinimized, setIsMinimized] = useState(false)
  
  // Dragging state
  const [position, setPosition] = useState({ x: 0, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const calculatorRef = useRef<HTMLDivElement>(null)

  // Set initial position after mount
  useEffect(() => {
    setPosition({ x: window.innerWidth - 350, y: 100 })
  }, [])

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return // Don't drag when clicking buttons
    
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

  const handleNumber = (num: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(num)
    } else {
      setDisplay(display + num)
    }
  }

  const handleOperator = (op: string) => {
    const current = parseFloat(display)
    
    if (previousValue === null) {
      setPreviousValue(current)
    } else if (operation) {
      const result = calculate(previousValue, current, operation)
      setPreviousValue(result)
      setDisplay(result.toString())
    }
    
    setOperation(op)
    setDisplay('0')
  }

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b
      case '-': return a - b
      case '×': return a * b
      case '÷': return b !== 0 ? a / b : 0
      case '%': return a % b
      default: return b
    }
  }

  const handleEquals = () => {
    if (previousValue !== null && operation) {
      const current = parseFloat(display)
      const result = calculate(previousValue, current, operation)
      setDisplay(result.toString())
      setPreviousValue(null)
      setOperation(null)
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
  }

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay('0')
    }
  }

  if (isMinimized) {
    return (
      <div
        ref={calculatorRef}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 9999
        }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-primary-500 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center space-x-2">
            <CalcIcon className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Calculator</span>
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
      ref={calculatorRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999
      }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-primary-500 w-80"
    >
      {/* Header - Draggable */}
      <div
        className="flex items-center justify-between p-3 bg-gradient-to-r from-primary-600 to-blue-600 rounded-t-lg cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center space-x-2">
          <CalcIcon className="w-5 h-5 text-white" />
          <span className="font-semibold text-white">Calculator</span>
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

      {/* Display */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900">
        <div className="text-right">
          {operation && <div className="text-xs text-gray-500 dark:text-gray-400">{previousValue} {operation}</div>}
          <div className="text-3xl font-bold text-gray-900 dark:text-white break-all">{display}</div>
        </div>
      </div>

      {/* Buttons */}
      <div className="p-4 grid grid-cols-4 gap-2">
        <button onClick={handleClear} className="col-span-2 p-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold">
          AC
        </button>
        <button onClick={handleBackspace} className="p-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-semibold">
          ⌫
        </button>
        <button onClick={() => handleOperator('÷')} className="p-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold">
          ÷
        </button>

        <button onClick={() => handleNumber('7')} className="p-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-semibold">
          7
        </button>
        <button onClick={() => handleNumber('8')} className="p-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-semibold">
          8
        </button>
        <button onClick={() => handleNumber('9')} className="p-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-semibold">
          9
        </button>
        <button onClick={() => handleOperator('×')} className="p-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold">
          ×
        </button>

        <button onClick={() => handleNumber('4')} className="p-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-semibold">
          4
        </button>
        <button onClick={() => handleNumber('5')} className="p-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-semibold">
          5
        </button>
        <button onClick={() => handleNumber('6')} className="p-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-semibold">
          6
        </button>
        <button onClick={() => handleOperator('-')} className="p-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold">
          -
        </button>

        <button onClick={() => handleNumber('1')} className="p-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-semibold">
          1
        </button>
        <button onClick={() => handleNumber('2')} className="p-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-semibold">
          2
        </button>
        <button onClick={() => handleNumber('3')} className="p-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-semibold">
          3
        </button>
        <button onClick={() => handleOperator('+')} className="p-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold">
          +
        </button>

        <button onClick={() => handleNumber('0')} className="col-span-2 p-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-semibold">
          0
        </button>
        <button onClick={handleDecimal} className="p-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-semibold">
          .
        </button>
        <button onClick={handleEquals} className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold">
          =
        </button>
      </div>
    </div>
  )
}
