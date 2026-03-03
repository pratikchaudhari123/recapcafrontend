'use client'

import { useState } from 'react'
import { Calculator, Clock } from 'lucide-react'
import FloatingCalculator from './FloatingCalculator'
import FloatingTimer from './FloatingTimer'

export default function FloatingWidgets() {
  const [showCalculator, setShowCalculator] = useState(false)
  const [showTimer, setShowTimer] = useState(false)

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3">
        {/* Calculator Button */}
        <button
          onClick={() => setShowCalculator(!showCalculator)}
          className={`p-4 rounded-full shadow-lg transition-all duration-200 ${
            showCalculator
              ? 'bg-primary-600 text-white scale-110'
              : 'bg-white dark:bg-gray-800 text-primary-600 hover:scale-110'
          }`}
          title="Calculator"
        >
          <Calculator className="w-6 h-6" />
        </button>

        {/* Timer Button */}
        <button
          onClick={() => setShowTimer(!showTimer)}
          className={`p-4 rounded-full shadow-lg transition-all duration-200 ${
            showTimer
              ? 'bg-green-600 text-white scale-110'
              : 'bg-white dark:bg-gray-800 text-green-600 hover:scale-110'
          }`}
          title="Study Timer"
        >
          <Clock className="w-6 h-6" />
        </button>
      </div>

      {/* Floating Widgets */}
      {showCalculator && <FloatingCalculator onClose={() => setShowCalculator(false)} />}
      {showTimer && <FloatingTimer onClose={() => setShowTimer(false)} />}
    </>
  )
}
