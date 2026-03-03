'use client'

import { useState, useEffect } from 'react'
import { Delete, History, Calculator as CalculatorIcon } from 'lucide-react'
import { apiService } from '@/services/api'
import toast from 'react-hot-toast'

interface CalculationHistory {
  id: string
  expression: string
  result: string
  timestamp: Date
}

export default function StudyCalculator() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [history, setHistory] = useState<CalculationHistory[]>([])
  const [showHistory, setShowHistory] = useState(false)

  // Load calculation history on component mount
  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const response = await apiService.getCalculatorHistory()
      setHistory(response.data?.history || [])
    } catch (error) {
      console.error('Error loading calculator history:', error)
    }
  }

  const saveCalculation = async (expression: string, result: string) => {
    try {
      await apiService.logCalculation({ expression, result })
      const newCalculation: CalculationHistory = {
        id: Date.now().toString(),
        expression,
        result,
        timestamp: new Date()
      }
      setHistory(prev => [newCalculation, ...prev.slice(0, 19)]) // Keep last 20
    } catch (error) {
      console.error('Error saving calculation:', error)
    }
  }

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? num : display + num)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }

  const clear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue
      case '-':
        return firstValue - secondValue
      case '×':
        return firstValue * secondValue
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0
      case '%':
        return firstValue % secondValue
      default:
        return secondValue
    }
  }

  const performCalculation = () => {
    const inputValue = parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      const expression = `${previousValue} ${operation} ${inputValue}`
      const result = String(newValue)

      setDisplay(result)
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)

      // Save to history
      saveCalculation(expression, result)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    const { key } = e
    
    if (key >= '0' && key <= '9') {
      inputNumber(key)
    } else if (key === '.') {
      inputDecimal()
    } else if (key === '+' || key === '-') {
      performOperation(key)
    } else if (key === '*') {
      performOperation('×')
    } else if (key === '/') {
      e.preventDefault()
      performOperation('÷')
    } else if (key === '%') {
      performOperation('%')
    } else if (key === 'Enter' || key === '=') {
      e.preventDefault()
      performCalculation()
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
      clear()
    } else if (key === 'Backspace') {
      if (display.length > 1) {
        setDisplay(display.slice(0, -1))
      } else {
        setDisplay('0')
      }
    }
  }

  const Button = ({ 
    onClick, 
    className = '', 
    children, 
    ...props 
  }: {
    onClick: () => void
    className?: string
    children: React.ReactNode
    [key: string]: any
  }) => (
    <button
      onClick={onClick}
      className={`h-12 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
      {...props}
    >
      {children}
    </button>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calculator */}
      <div className="lg:col-span-2">
        <div className="card" onKeyDown={handleKeyPress} tabIndex={0}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <CalculatorIcon className="w-6 h-6 mr-2" />
              Calculator
            </h2>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="btn-secondary flex items-center space-x-2"
            >
              <History className="w-4 h-4" />
              <span>History</span>
            </button>
          </div>

          {/* Display */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6">
            <div className="text-right">
              {operation && previousValue !== null && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {previousValue} {operation}
                </div>
              )}
              <div className="text-3xl font-mono font-bold text-gray-900 dark:text-gray-100 break-all">
                {display}
              </div>
            </div>
          </div>

          {/* Button Grid */}
          <div className="grid grid-cols-4 gap-3">
            {/* Row 1 */}
            <Button
              onClick={clear}
              className="bg-red-500 hover:bg-red-600 text-white col-span-2"
            >
              Clear
            </Button>
            <Button
              onClick={() => {
                if (display.length > 1) {
                  setDisplay(display.slice(0, -1))
                } else {
                  setDisplay('0')
                }
              }}
              className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              <Delete className="w-4 h-4 mx-auto" />
            </Button>
            <Button
              onClick={() => performOperation('÷')}
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              ÷
            </Button>

            {/* Row 2 */}
            <Button
              onClick={() => inputNumber('7')}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              7
            </Button>
            <Button
              onClick={() => inputNumber('8')}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              8
            </Button>
            <Button
              onClick={() => inputNumber('9')}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              9
            </Button>
            <Button
              onClick={() => performOperation('×')}
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              ×
            </Button>

            {/* Row 3 */}
            <Button
              onClick={() => inputNumber('4')}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              4
            </Button>
            <Button
              onClick={() => inputNumber('5')}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              5
            </Button>
            <Button
              onClick={() => inputNumber('6')}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              6
            </Button>
            <Button
              onClick={() => performOperation('-')}
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              -
            </Button>

            {/* Row 4 */}
            <Button
              onClick={() => inputNumber('1')}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              1
            </Button>
            <Button
              onClick={() => inputNumber('2')}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              2
            </Button>
            <Button
              onClick={() => inputNumber('3')}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              3
            </Button>
            <Button
              onClick={() => performOperation('+')}
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              +
            </Button>

            {/* Row 5 */}
            <Button
              onClick={() => inputNumber('0')}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 col-span-2"
            >
              0
            </Button>
            <Button
              onClick={inputDecimal}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              .
            </Button>
            <Button
              onClick={performCalculation}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              =
            </Button>
          </div>

          {/* Additional Functions */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button
              onClick={() => performOperation('%')}
              className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              % (Modulo)
            </Button>
            <Button
              onClick={() => {
                const value = parseFloat(display)
                setDisplay(String(Math.sqrt(value)))
                toast.success('Square root calculated')
              }}
              className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              √ (Square Root)
            </Button>
          </div>

          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            <p>Keyboard shortcuts: Numbers (0-9), operators (+, -, *, /), Enter (=), Escape (Clear), Backspace</p>
          </div>
        </div>
      </div>

      {/* History Panel */}
      <div className={`${showHistory ? 'block' : 'hidden lg:block'}`}>
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <History className="w-5 h-5 mr-2" />
            Calculation History
          </h3>
          
          {history.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No calculations yet
            </p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {history.map((calc) => (
                <div
                  key={calc.id}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  onClick={() => {
                    setDisplay(calc.result)
                    toast.success('Result loaded to calculator')
                  }}
                >
                  <div className="font-mono text-sm">
                    {calc.expression} = {calc.result}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {calc.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {history.length > 0 && (
            <button
              onClick={() => {
                setHistory([])
                toast.success('History cleared')
              }}
              className="w-full mt-4 btn-secondary text-sm"
            >
              Clear History
            </button>
          )}
        </div>
      </div>
    </div>
  )
}