'use client';

import { useState, useEffect } from 'react';
import { Clock, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  answer: string;
  timestamp: Date;
  category: string;
}

export default function QuestionHistory() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Load questions from localStorage or API
    const savedQuestions = localStorage.getItem('questionHistory');
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    }
  }, []);

  const filteredQuestions = questions.filter(q => 
    filter === 'all' || q.category === filter
  );

  const categories = ['all', ...Array.from(new Set(questions.map(q => q.category)))];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover-lift">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Question History
          </h2>
        </div>
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 animate-fadeIn">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 opacity-50" />
            </div>
            <p className="font-medium mb-1">No questions asked yet</p>
            <p className="text-sm">Start asking questions to see your history here</p>
          </div>
        ) : (
          filteredQuestions.map((question, index) => (
            <div
              key={question.id}
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer hover:shadow-md animate-fadeIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className="flex items-start justify-between"
                onClick={() => toggleExpand(question.id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {question.question}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatTime(question.timestamp)}</span>
                    </div>
                    <span className="badge badge-primary">
                      {question.category}
                    </span>
                  </div>
                </div>
                <button className="ml-3 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors flex-shrink-0">
                  {expandedId === question.id ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              
              {expandedId === question.id && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 animate-fadeIn">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {question.answer}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}